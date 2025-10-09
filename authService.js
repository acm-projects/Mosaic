import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const signUpWithEmail = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};