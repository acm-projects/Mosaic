import { firestore } from "@/lib/firebase_config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "./firestore_types";

export async function new_user(uid: string, email: string, username: string) {
    try {
        const userRef = doc(firestore, "Users", uid);

        await setDoc(userRef, {
            email,
            username,
            'groups': [],
            'favorite_movies': [],
            'favorite_genre': [],
            'favorite_actor': [],
            'favorite_director': [],
            'taken_quiz': false,
            'mood': {},
            createdAt: new Date().toISOString(),
        });

        return true;
    } catch (error: any) {
        return error.message;
    }
}

export async function add_quiz(uid: string, favorite_genre: string[], mood: Map<string, string>) {
    try {
        const userRef = doc(firestore, "Users", uid);

        await setDoc(userRef, {
            favorite_genre,
            mood,
            taken_quiz: true,
        }, { merge: true });

        return true;
    } catch (error: any) {
        return error.message;
    }
}

export async function get_user_data(uid: string): Promise<User | null | string> {
    try {
        const userRef = doc(firestore, "Users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as User;
        } else {
            return null;
        }
    } catch (error: any) {
        return error.message;
    }
}