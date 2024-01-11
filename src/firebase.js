import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const perf = getPerformance(app);
const analytics = getAnalytics(app);
logEvent(analytics, 'login');


export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const name = result.user.displayName;
      console.log(`Welcome back ${name}!`)
    }).catch(error => {
      console.log(error.message);
    });
};