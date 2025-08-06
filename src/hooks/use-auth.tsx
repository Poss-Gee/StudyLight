
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string, role: 'student' | 'teacher') => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: (role: 'student' | 'teacher') => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          setUser(user);
        } else {
          // If user exists in auth but not firestore, something is wrong. Log them out.
          await signOut(auth);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const publicPaths = ['/', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/');
    } else if (user && userProfile) {
        if (isPublicPath) {
            const dashboardUrl = userProfile.role === 'teacher' ? '/teacher/dashboard' : '/dashboard';
            router.push(dashboardUrl);
        }
    }
  }, [user, userProfile, loading, pathname, router]);

  const createUserInFirestore = async (
    uid: string,
    name: string,
    email: string,
    role: 'student' | 'teacher'
  ) => {
    const userDocRef = doc(db, 'users', uid);
    const newUserProfile: UserProfile = { uid, name, email, role };
    await setDoc(userDocRef, newUserProfile);
    setUserProfile(newUserProfile);
  };
  
  const login = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string, role: 'student' | 'teacher') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    await createUserInFirestore(userCredential.user.uid, name, email, role);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const signInWithGoogle = async (role: 'student' | 'teacher') => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
       await createUserInFirestore(
        result.user.uid,
        result.user.displayName || 'Anonymous',
        result.user.email!,
        role
      );
    }
  };
  
  const value = { user, userProfile, loading, login, signup, logout, signInWithGoogle };
  
  if(loading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading authentication...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
