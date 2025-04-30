import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

// 1. Add daily entry
export const addEntry = async (entry: {
  userId: string;
  mood: string;
  symptoms: string[];
  note: string;
}) => {
  await addDoc(collection(db, 'entries'), {
    ...entry,
    timestamp: serverTimestamp()
  });
};

// 2. Add user info (used on signup)
export const addUser = async (user: {
  uid: string;
  displayName: string;
  email: string;
  language: string;
}) => {
  await setDoc(doc(db, 'users', user.uid), {
    ...user,
    createdAt: serverTimestamp()
  });
};

// 3. Log AI assistant request (optional)
export const logAIRequest = async (log: {
  userId: string;
  prompt: string;
  response: string;
}) => {
  await addDoc(collection(db, 'ai_requests'), {
    ...log,
    timestamp: serverTimestamp()
  });
};

// 4. Log report export (optional)
export const logReport = async (report: {
  userId: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
}) => {
  await addDoc(collection(db, 'reports'), {
    ...report,
    generatedAt: serverTimestamp()
  });
};
