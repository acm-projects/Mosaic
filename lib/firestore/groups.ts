import { require_user } from "@/lib/auth";
import { firestore } from "@/lib/firebase_config";
import { Result } from "@/lib/types";
import { addDoc, collection, doc, FirestoreError, getDoc, getDocs, query, runTransaction, setDoc, where } from "firebase/firestore";

async function generate_join_code(): Promise<string> {
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
}

export async function create_group(
    group_name: string,
    selected_color: string
): Promise<Result<string>> {
    try {
        const user = require_user();

        const join_code = await generate_join_code();

        const groups_ref = collection(firestore, "Groups");
        const doc_ref = await addDoc(groups_ref, {
            createdAt: new Date().toISOString(),
            members: [user.uid],
            join_code,
            group_name,
            selected_color,
        });

        const user_ref = doc(firestore, "Users", user.uid);
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

        return { ok: true, data: join_code };
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

export async function join_group(join_code: string): Promise<Result<boolean>> {
    try {
        const user = require_user();

        const groups_ref = collection(firestore, "Groups");
        const q = query(groups_ref, where("join_code", "==", join_code.trim().toUpperCase()));
        const query_snapshot = await getDocs(q);

        if (query_snapshot.empty) {
            return { ok: false, error: "Invalid join code", code: "invalid_code" };
        }

        const group_doc = query_snapshot.docs[0];
        const group_ref = doc(firestore, "Groups", group_doc.id);
        const user_ref = doc(firestore, "Users", user.uid);

        await runTransaction(firestore, async (transaction) => {
            const group_snap = await transaction.get(group_ref);
            const user_snap = await transaction.get(user_ref);

            if (!group_snap.exists()) throw new Error("Group does not exist");
            const group_data = group_snap.data();

            const members: string[] = group_data.members || [];
            if (members.includes(user.uid)) {
                throw new Error("User already in the group");
            }

            transaction.update(group_ref, {
                members: [...members, user.uid],
            });

            const existingGroups = user_snap.exists() ? user_snap.data()?.groups || [] : [];
            transaction.set(
                user_ref,
                { groups: Array.from(new Set([...existingGroups, group_ref.id])) },
                { merge: true }
            );
        });

        return { ok: true, data: true };
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