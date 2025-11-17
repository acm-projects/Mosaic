import { User } from "@/lib/firestore/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "../firebase_config";

export async function get_user_data(uid: string): Promise<User | null | string> {
    try {
        const user_ref = doc(firestore, "Users", uid);
        const user_snap = await getDoc(user_ref);

        if (user_snap.exists()) {
            return user_snap.data() as User;
        } else {
            return null;
        }
    } catch (error: any) {
        return error.message;
    }
}

export async function new_user(uid: string, email: string, username: string) {
    try {
        const user_ref = doc(firestore, "Users", uid);

        await setDoc(user_ref, {
            email,
            username,
            'groups': [],
            'favorite_movies': [],
            'favorite_genre': [],
            'favorite_actor': [],
            'favorite_director': [],
            'taken_quiz': false,
            'mood': {},
            createdAt: serverTimestamp(),
        });

        return true;
    } catch (error: any) {
        return error.message;
    }
}

export async function add_quiz(uid: string, favorite_genre: string[], mood: Record<string, string>) {
    try {
        const user_ref = doc(firestore, "Users", uid);

        await setDoc(user_ref, {
            favorite_genre,
            mood,
            taken_quiz: true,
        }, { merge: true });

        return true;
    } catch (error: any) {
        return error.message;
    }
}