// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD9J6vbTPdLiwyi4mIk5I5YvLM6iYDZ_d8",
    authDomain: "mosaic-9b636.firebaseapp.com",
    projectId: "mosaic-9b636",
    storageBucket: "mosaic-9b636. firebasestorage.app", 
    messagingSenderId: "864963208412",
    appId: "1:864963208412 :web : adb3286b9c6c8f9083c019", 
    measurementId: "G-FCD3CYFV5H"
} ;
// Initialize Firebase
const app = initializeApp (firebaseConfig) ;
const analytics = getAnalytics(app) ;