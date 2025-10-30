// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth"; // <-- ADDED: Import getAuth and Auth type

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMel-iwoH8t6EcttO-OVntj9S87CFrVW4",
  authDomain: "sellkar-india.firebaseapp.com",
  projectId: "sellkar-india",
  storageBucket: "sellkar-india.firebasestorage.app",
  messagingSenderId: "221668061547",
  appId: "1:221668061547:web:fb5597572a5552f75f5c2e",
  measurementId: "G-FWW4TFMNFN"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and EXPORT Auth
// This resolves the error 'does not provide an export named 'auth''
export const auth: Auth = getAuth(app); 
