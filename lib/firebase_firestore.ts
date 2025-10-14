import { firestore } from "@/lib/firebase_config";
import { doc, setDoc } from "firebase/firestore";

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
            createdAt: new Date().toISOString(),
        });

        console.log("User document created for UID:", uid);
        return true;
    } catch (error: any) {
        console.error("Error creating user document:", error.message);
        return error.message;
    }
}
