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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Firebase environment variables are not set. Add VITE_FIREBASE_* variables to your deployment."
  );
}

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
  const write = addDoc(collection(db, "survey_responses"), {
    ...payload,
    submittedAt: serverTimestamp(),
  });

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("Request timed out. Please check your connection and try again.")),
      15000
    )
  );

  const docRef = await Promise.race([write, timeout]);
  return docRef.id;
}

export function generateResponseId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "EUR-";
  for (let i = 0; i < 6; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}
