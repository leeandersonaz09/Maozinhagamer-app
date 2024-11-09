import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAIjI7Ta7PO_5MEoFhPbS52GuW79Lydct8",
  authDomain: "maozinhagamerapp-2f0c7.firebaseapp.com",
  projectId: "maozinhagamerapp-2f0c7",
  storageBucket: "maozinhagamerapp-2f0c7.firebasestorage.app",
  messagingSenderId: "198860100597",
  appId: "1:198860100597:web:4c6618043b2cd1199106bc",
  measurementId: "G-2WNXH62PSG",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Exporting initialized services
export { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_APP };

