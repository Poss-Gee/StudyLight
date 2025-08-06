
import { db, storage } from './firebase';
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
  runTransaction,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Subject, Note, Quiz, QuizHistory, UserProfile } from './types';


export const uploadProfilePicture = async (file: File, userId: string): Promise<string> => {
    const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { photoURL: downloadURL });
    
    return downloadURL;
}

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
    // This is more complex now. You'd also need to delete all notes and quizzes for this subject.
    // For simplicity, we'll just delete the subject doc for now.
    const subjectDoc = doc(db, 'subjects', id);
    await deleteDoc(subjectDoc);
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
  const subjectDocRef = doc(db, 'subjects', note.subject);
  
  return await runTransaction(db, async (transaction) => {
    const subjectDoc = await transaction.get(subjectDocRef);
    if (!subjectDoc.exists()) {
      throw "Subject does not exist!";
    }

    let noteId: string;
    if (id) {
      // It's an update, so count doesn't change
      const noteDoc = doc(db, 'notes', id);
      transaction.update(noteDoc, note);
      noteId = id;
    } else {
      // It's a new note, so we increment the count
      const newNoteRef = doc(collection(db, 'notes'));
      transaction.set(newNoteRef, note);
      const newNoteCount = (subjectDoc.data().noteCount || 0) + 1;
      transaction.update(subjectDocRef, { noteCount: newNoteCount });
      noteId = newNoteRef.id;
    }
    return noteId;
  });
};

export const deleteNote = async (noteId: string): Promise<void> => {
    const noteDocRef = doc(db, 'notes', noteId);
    
    await runTransaction(db, async (transaction) => {
        const noteDoc = await transaction.get(noteDocRef);
        if (!noteDoc.exists()) {
            throw "Note does not exist!";
        }

        const subjectId = noteDoc.data().subject;
        const subjectDocRef = doc(db, 'subjects', subjectId);
        
        const subjectDoc = await transaction.get(subjectDocRef);
        if(subjectDoc.exists()){
            const newNoteCount = Math.max(0, (subjectDoc.data().noteCount || 0) - 1);
            transaction.update(subjectDocRef, { noteCount: newNoteCount });
        }
        
        transaction.delete(noteDocRef);
    });
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

export const saveQuiz = async (quiz: Omit<Quiz, 'id'>, id?: string): Promise<string> => {
  const subjectDocRef = doc(db, 'subjects', quiz.subject);
  
  return await runTransaction(db, async (transaction) => {
    const subjectDoc = await transaction.get(subjectDocRef);
    if (!subjectDoc.exists()) {
      throw "Subject does not exist!";
    }

    let quizId: string;
    if (id) {
      // It's an update, so count doesn't change
      const quizDoc = doc(db, 'quizzes', id);
      transaction.update(quizDoc, quiz);
      quizId = id;
    } else {
      // It's a new quiz, so we increment the count
      const newQuizRef = doc(collection(db, 'quizzes'));
      transaction.set(newQuizRef, quiz);
      const newQuizCount = (subjectDoc.data().quizCount || 0) + 1;
      transaction.update(subjectDocRef, { quizCount: newQuizCount });
      quizId = newQuizRef.id;
    }
    return quizId;
  });
};


export const deleteQuiz = async (quizId: string): Promise<void> => {
    const quizDocRef = doc(db, 'quizzes', quizId);

    await runTransaction(db, async (transaction) => {
        const quizDoc = await transaction.get(quizDocRef);
        if (!quizDoc.exists()) {
            throw "Quiz does not exist!";
        }

        const subjectId = quizDoc.data().subject;
        const subjectDocRef = doc(db, 'subjects', subjectId);

        const subjectDoc = await transaction.get(subjectDocRef);
        if (subjectDoc.exists()) {
            const newQuizCount = Math.max(0, (subjectDoc.data().quizCount || 0) - 1);
            transaction.update(subjectDocRef, { quizCount: newQuizCount });
        }

        transaction.delete(quizDocRef);
    });
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


// --- Student Data Functions ---
export const getStudents = async (): Promise<UserProfile[]> => {
  const usersCol = collection(db, 'users');
  const q = query(usersCol, where('role', '==', 'student'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as UserProfile);
};
