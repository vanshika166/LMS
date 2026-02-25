import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "login-lms-7b452.firebaseapp.com",
  projectId: "login-lms-7b452",
  storageBucket: "login-lms-7b452.firebasestorage.app",
  messagingSenderId: "273463561559",
  appId: "1:273463561559:web:043e4992de1c164736c212"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider} 
