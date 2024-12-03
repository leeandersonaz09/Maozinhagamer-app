import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importando AsyncStorage para persistência

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

// Initialize Firestore
const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Initialize Auth with persistence
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage), // Usando AsyncStorage para persistência
});

// Exporting initialized services
export { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_APP };
