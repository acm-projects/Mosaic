import { FirestoreUser, Result } from "@/lib/types";
import { doc, FirestoreError, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "../firebase_config";

export async function get_user_data(uid: string): Promise<Result<FirestoreUser>> {
    try {
        const user_ref = doc(firestore, "Users", uid);
        const user_snap = await getDoc(user_ref);

        if (user_snap.exists()) {
            return { ok: true, data: (user_snap.data() as FirestoreUser) };
        } else {
            return { ok: false, error: "No such user!", code: "404" };
        }
    } catch (error) {
        let error_code = "unknown";
        let error_message = "An unknown error occurred.";

        if (error instanceof FirestoreError) {
            error_message = error.message;
            error_code = error.code;
        }

        return { ok: false, error: error_message, code: error_code }
    }
}

export async function new_user(uid: string, email: string, username: string): Promise<Result<boolean>> {
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

        return { ok: true, data: true };
    } catch (error: any) {
        let error_code = "unknown";
        let error_message = "An unknown error occurred.";

        if (error instanceof FirestoreError) {
            error_message = error.message;
            error_code = error.code;
        }

        return { ok: false, error: error_message, code: error_code }
    }
}

export async function add_quiz(uid: string, favorite_genre: string[], mood: Record<string, string>, providers: string[]): Promise<Result<boolean>> {
    try {
        const user_ref = doc(firestore, "Users", uid);

        await setDoc(user_ref, {
            favorite_genre,
            mood,
            taken_quiz: true,
            done_movie_swipe: false,
            providers,
        }, { merge: true });

        return { ok: true, data: true };
    } catch (error: any) {
        let error_code = "unknown";
        let error_message = "An unknown error occurred.";

        if (error instanceof FirestoreError) {
            error_message = error.message;
            error_code = error.code;
        }

        return { ok: false, error: error_message, code: error_code }
    }
}

export async function update_favorite_movies(uid: string, favorite_movies: number[]): Promise<Result<boolean>> {
    try {
        const user_ref = doc(firestore, "Users", uid);

        await setDoc(user_ref, {
            favorite_movies,
        }, { merge: true });

        return { ok: true, data: true };
    } catch (error: any) {
        let error_code = "unknown";
        let error_message = "An unknown error occurred.";

        if (error instanceof FirestoreError) {
            error_message = error.message;
            error_code = error.code;
        }

        return { ok: false, error: error_message, code: error_code }
    }
}