import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCPo-k65Z1Rj4_WrWSgHUtl-8gXUP8u0Jk",
  authDomain: "qas-2026.firebaseapp.com",
  projectId: "qas-2026",
  storageBucket: "qas-2026.firebasestorage.app",
  messagingSenderId: "536015498250",
  appId: "1:536015498250:web:013e243fd9880ab71243f3",
  measurementId: "G-BS5L8FXJ4N"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export const getAnalyticsInstance = async () => {
  if (await isSupported()) return getAnalytics(app);
  return null;
};

export default app;
