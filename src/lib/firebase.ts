
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-6rLbgRS2IljcSlgIcSmtl3Z-VPY47Ro",
  authDomain: "studygroupapp-fbb3f.firebaseapp.com",
  projectId: "studygroupapp-fbb3f",
  storageBucket: "studygroupapp-fbb3f.appspot.com",
  messagingSenderId: "337229658567",
  appId: "1:337229658567:web:de11825e1e1bcf181a41e2",
  measurementId: "G-VD086S2NLQ"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
