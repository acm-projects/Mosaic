import { auth, firestore } from "@/lib/firebase_config";
import { addDoc, collection, doc, FirestoreError, getDoc, getDocs, query, runTransaction, setDoc, where } from "firebase/firestore";
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

export async function add_quiz(uid: string, favorite_genre: string[], mood: Record<string, string>) {
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

export async function create_group(
    group_name: string,
    selected_color: string
): Promise<string> {
    try {
        if (!auth.currentUser) {
            throw new Error("User not authenticated");
        }

        const generate_join_code = async (): Promise<string> => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";

            while (true) {
                const code =
                    Array.from({ length: 3 }, () =>
                        letters.charAt(Math.floor(Math.random() * letters.length))
                    ).join("") +
                    Array.from({ length: 3 }, () =>
                        numbers.charAt(Math.floor(Math.random() * numbers.length))
                    ).join("");

                const existing = await getDocs(
                    query(collection(firestore, "Groups"), where("join_code", "==", code))
                );

                if (existing.empty) return code;
            }
        };

        const join_code = await generate_join_code();

        const groups_ref = collection(firestore, "Groups");
        const doc_ref = await addDoc(groups_ref, {
            createdAt: new Date().toISOString(),
            members: [auth.currentUser.uid],
            join_code,
            group_name,
            selected_color,
        });

        const user_ref = doc(firestore, "Users", auth.currentUser.uid);
        const user_snap = await getDoc(user_ref);

        const existing_groups = user_snap.exists()
            ? user_snap.data()?.groups || []
            : [];

        await setDoc(
            user_ref,
            {
                groups: Array.from(new Set([...existing_groups, doc_ref.id])),
            },
            { merge: true }
        );

        return join_code;
    } catch (error) {
        const message =
            (error as FirestoreError)?.message || "Failed to create group";
        console.error("create_group error:", message);
        return message;
    }
}

export async function join_group(join_code: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!auth.currentUser) {
            return { success: false, error: "User not authenticated" };
        }

        const groups_ref = collection(firestore, "Groups");
        const q = query(groups_ref, where("join_code", "==", join_code.trim().toUpperCase()));
        const query_snapshot = await getDocs(q);

        if (query_snapshot.empty) {
            return { success: false, error: "Group not found" };
        }

        const group_doc = query_snapshot.docs[0];
        const group_ref = doc(firestore, "Groups", group_doc.id);
        const user_ref = doc(firestore, "Users", auth.currentUser.uid);

        await runTransaction(firestore, async (transaction) => {
            const group_snap = await transaction.get(group_ref);
            const user_snap = await transaction.get(user_ref);

            if (!group_snap.exists()) throw new Error("Group does not exist");
            const group_data = group_snap.data();

            const members: string[] = group_data.members || [];
            if (members.includes(auth.currentUser!.uid)) {
                throw new Error("User already in the group");
            }

            transaction.update(group_ref, {
                members: [...members, auth.currentUser!.uid],
            });

            const existingGroups = user_snap.exists() ? user_snap.data()?.groups || [] : [];
            transaction.set(
                user_ref,
                { groups: Array.from(new Set([...existingGroups, group_ref.id])) },
                { merge: true }
            );
        });

        return { success: true };
    } catch (error) {
        const message = (error as FirestoreError)?.message || "Failed to join group";
        console.error("join_group error:", message);
        return { success: false, error: message };
    }
}