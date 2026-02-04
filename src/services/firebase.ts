// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4HyqMmO4ejQgRBpoWS9ur3UEZRSYDIPA",
  authDomain: "flugo-test.firebaseapp.com",
  projectId: "flugo-test",
  storageBucket: "flugo-test.firebasestorage.app",
  messagingSenderId: "941261968582",
  appId: "1:941261968582:web:e10e6f243647207fe5f3c7",
  measurementId: "G-CWF239KCL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);