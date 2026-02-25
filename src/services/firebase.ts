import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface SurveyPayload {
  responseId: string;
  submittedAt: ReturnType<typeof serverTimestamp>;
  profile: {
    yearLevel: string;
    department: string;
    visitFrequency: string;
  };
  queuingExperience: Record<string, { statement: string; rating: number }>;
  receptiveness: Record<string, { statement: string; rating: number }>;
  openFeedback: {
    biggestChallenge: string | null;
    desiredFeatures: string | null;
    otherComments: string | null;
  };
}

export async function submitSurveyResponse(
  payload: Omit<SurveyPayload, "submittedAt">
) {
  const docRef = await addDoc(collection(db, "survey_responses"), {
    ...payload,
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export function generateResponseId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "EUR-";
  for (let i = 0; i < 6; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}
