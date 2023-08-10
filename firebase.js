import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const clientCredentials = {
  apiKey: "AIzaSyCKp8_fneYw4Z09Nqy5osJu4FREf_ZRzpw",
  authDomain: "solanacrowdfund.firebaseapp.com",
  projectId: "solanacrowdfund",
  storageBucket: "solanacrowdfund.appspot.com",
  messagingSenderId: "775265765190",
  appId: "1:775265765190:web:7d39295c88bc0433af0747",
};

export const app = initializeApp(clientCredentials);
export const auth = getAuth(app);
export const db = getFirestore(app);
