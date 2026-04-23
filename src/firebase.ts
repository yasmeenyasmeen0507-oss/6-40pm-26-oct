import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ8AzovFCN1VIifB2HTDAhHwVMmr7ikkQ",
  authDomain: "sellkarindia-e4764.firebaseapp.com",
  projectId: "sellkarindia-e4764",
  storageBucket: "sellkarindia-e4764.firebasestorage.app",
  messagingSenderId: "129350411784",
  appId: "1:129350411784:web:cf9164207e6e90ea3a13bd"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TEMPORARY: App Check disabled for localhost development
// This allows phone authentication to work without setting up debug tokens
// TODO: Uncomment this block after adding debug token to Firebase Console
// Instructions: https://console.firebase.google.com/project/sellkar-e38e2/appcheck/apps
/*
if (typeof window !== 'undefined') {
  if (import.meta.env.DEV) {
    // @ts-ignore
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('🔧 App Check Debug Mode enabled for development');
  }

  try {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LcMZR0UAAAAALgPMcgHwga7gY5p8QMg1Hj-bmUv'),
      isTokenAutoRefreshEnabled: true
    });
    console.log('✅ App Check initialized successfully');
  } catch (error) {
    console.warn('⚠️ App Check initialization failed:', error);
  }
}
*/

console.log('⚠️ App Check is DISABLED - phone auth should work on localhost now');

// Initialize and EXPORT Auth
export const auth: Auth = getAuth(app);
