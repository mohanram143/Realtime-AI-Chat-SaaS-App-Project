// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Save new user to Firestore (only on first login)
  const saveUserToFirestore = async (firebaseUser, extra = {}) => {
    try {
      const ref  = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName || extra.name || "",
          photoURL:    firebaseUser.photoURL    || "",
          provider:    extra.provider           || "email",
          createdAt:   serverTimestamp(),
        });
      }
    } catch (err) {
      // Non-fatal: Firestore write failure shouldn't break auth
      console.warn("Firestore save skipped:", err.message);
    }
  };

  // Sign Up with Email + Password
  const signUp = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await cred.user.reload();
    setUser({ ...cred.user });
    await saveUserToFirestore(cred.user, { name, provider: "email" });
    return cred.user;
  };

  // Sign In with Email + Password
  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  // Sign In with Google Popup
  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(cred.user, { provider: "google" });
    return cred.user;
  };

  // Logout
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};