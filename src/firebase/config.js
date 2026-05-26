// src/firebase/config.js
import { initializeApp }       from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore }        from "firebase/firestore";
import { getAnalytics }        from "firebase/analytics";

const firebaseConfig = {
  apiKey:            "AIzaSyB1gluBWdk5oaW4R2MR0Byf1-G87foIx8k",
  authDomain:        "chat-app-ai-76989.firebaseapp.com",
  projectId:         "chat-app-ai-76989",
  storageBucket:     "chat-app-ai-76989.firebasestorage.app",
  messagingSenderId: "844540596633",
  appId:             "1:844540596633:web:050c9f522b9d693e7e4308",
  measurementId:     "G-C3TSVPSDD5",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics      = getAnalytics(app);

googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;