export type Subject = {
  id: string;
  name: string;
  description: string;
  image: string;
  noteCount: number;
  quizCount: number;
};

export type Note = {
  id: string;
  subject: string;
  title: string;
  content: string;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
};

export type QuizHistory = {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  date: string; // Stored as ISO string
};

// This is for the user profile document in Firestore
export type UserProfile = {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'student' | 'teacher';
  quizHistory?: QuizHistory[]; // Optional: can be a subcollection
};
