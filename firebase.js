// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  serverTimestamp,
  doc, setDoc, getDoc, addDoc, updateDoc,
  collection, onSnapshot, query, where, orderBy, limit
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAGl6xz-C7TTtWKQRX5B3gYv4fDld8qJT0",
  authDomain: "rn-chat-b5646.firebaseapp.com",
  projectId: "rn-chat-b5646",
  storageBucket: "rn-chat-b5646.firebasestorage.app",
   appId: "1:708782590974:web:2935ad4e0bc326b0134eaf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// handy re-exports
export {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, serverTimestamp, doc, setDoc, getDoc, addDoc,
  updateDoc, collection, onSnapshot, query, where, orderBy, limit
};
