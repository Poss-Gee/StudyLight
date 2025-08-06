import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import type { Subject, Note, Quiz, QuizHistory, UserProfile } from './types';

// --- Subject Functions ---

export const getSubjects = async (): Promise<Subject[]> => {
  const subjectsCol = collection(db, 'subjects');
  const snapshot = await getDocs(subjectsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject));
};

export const getSubject = async (id: string): Promise<Subject | null> => {
    const subjectDoc = doc(db, 'subjects', id);
    const snapshot = await getDoc(subjectDoc);
    if(snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Subject;
    }
    return null;
}

export const saveSubject = async (subject: Omit<Subject, 'id'>, id?: string): Promise<string> => {
  if (id) {
    const subjectDoc = doc(db, 'subjects', id);
    await updateDoc(subjectDoc, subject);
    return id;
  } else {
    const subjectsCol = collection(db, 'subjects');
    const newDoc = await addDoc(subjectsCol, subject);
    return newDoc.id;
  }
};

export const deleteSubject = async (id: string): Promise<void> => {
    const subjectDoc = doc(db, 'subjects', id);
    await deleteDoc(subjectDoc);
    // You might also want to delete related notes and quizzes here
}


// --- Note Functions ---

export const getNotesForSubject = async (subjectId: string): Promise<Note[]> => {
  const notesCol = collection(db, 'notes');
  const q = query(notesCol, where('subject', '==', subjectId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note));
};

export const getNote = async (id: string): Promise<Note | null> => {
    const noteDoc = doc(db, 'notes', id);
    const snapshot = await getDoc(noteDoc);
    if(snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Note;
    }
    return null;
}

export const saveNote = async (note: Omit<Note, 'id'>, id?: string): Promise<string> => {
  if (id) {
    const noteDoc = doc(db, 'notes', id);
    await updateDoc(noteDoc, note);
    return id;
  } else {
    const notesCol = collection(db, 'notes');
    const newDoc = await addDoc(notesCol, note);
    return newDoc.id;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
    const noteDoc = doc(db, 'notes', id);
    await deleteDoc(noteDoc);
}


// --- Quiz Functions ---

export const getQuizzes = async (): Promise<Quiz[]> => {
    const quizzesCol = collection(db, 'quizzes');
    const snapshot = await getDocs(quizzesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
}

export const getQuiz = async (id: string): Promise<Quiz | null> => {
    const quizDoc = doc(db, 'quizzes', id);
    const snapshot = await getDoc(quizDoc);
    if(snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Quiz;
    }
    return null;
}

export const deleteQuiz = async (id: string): Promise<void> => {
    const quizDoc = doc(db, 'quizzes', id);
    await deleteDoc(quizDoc);
}


// --- User Profile and Quiz History ---

export const getUserQuizHistory = async (userId: string): Promise<QuizHistory[]> => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        return profile.quizHistory || [];
    }
    return [];
}

export const saveQuizResult = async (userId: string, result: Omit<QuizHistory, 'id'>) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        const newHistory: QuizHistory = {
            ...result,
            id: `hist-${Date.now()}`,
            date: new Date().toISOString(),
        }
        const updatedHistory = [...(profile.quizHistory || []), newHistory];
        
        await updateDoc(userDocRef, {
            quizHistory: updatedHistory
        });
    }
}
