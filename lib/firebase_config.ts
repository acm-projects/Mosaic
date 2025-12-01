import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebase_config = {
  apiKey: "AIzaSyD9J6vbTPdLiwyi4mIk5I5YvLM6iYDZ_d8",
  authDomain: "mosaic-9b636.firebaseapp.com",
  projectId: "mosaic-9b636",
  storageBucket: "mosaic-9b636.firebasestorage.app",
  messagingSenderId: "864963208412",
  appId: "1:864963208412:web:aca44e63cec3effd83c019",
  measurementId: "G-8J708KR0J4"
};

const app = initializeApp(firebase_config);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };

