// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDswTu692hfGN_-5Tn8h2o5B1cmzwmNCoE",
  authDomain: "expenzo-f5be7.firebaseapp.com",
  projectId: "expenzo-f5be7",
  storageBucket: "expenzo-f5be7.appspot.com",
  messagingSenderId: "754150530742",
  appId: "1:754150530742:web:d94782a5f5f0539a709017",
  measurementId: "G-X1Y5NEJFBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,analytics,provider, doc, setDoc, auth};