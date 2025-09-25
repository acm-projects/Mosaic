import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebase_config = {
    apiKey: "AIzaSyD9J6vbTPdLiwyi4mIk5I5YvLM6iYDZ_d8",
    authDomain: "mosaic-9b636.firebaseapp.com",
    projectId: "mosaic-9b636",
    storageBucket: "mosaic-9b636.firebasestorage.app",
    messagingSenderId: "864963208412",
    appId: "1:864963208412:web:adb3286b9c6c8f9083c019",
    measurementId: "G-FCD3CYFV5H"
};

export const FIREBASE_APP = initializeApp(firebase_config);
const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
