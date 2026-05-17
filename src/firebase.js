// src/firebase.js
// ─────────────────────────────────────────────────────────────
// Fill in your own Firebase project credentials below.
// You get these from: Firebase Console → Project Settings → Your Apps → SDK setup
// ─────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXQA4RzpUFfkzWU7_NfRtwZ1qGg0TD_LI",
  authDomain: "suraj-salihu.firebaseapp.com",
  projectId: "suraj-salihu",
  messagingSenderId: "561836580762",
  appId: "1:561836580762:web:4abf1110bc7ed441bb6423",
  measurementId: "G-8HV75QCWGC"
};

const app       = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
// Firestore-only setup: storage is disabled because image uploads go to Cloudinary.
// export const storage = getStorage(app);
