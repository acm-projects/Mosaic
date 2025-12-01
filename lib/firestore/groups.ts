import { require_user } from "@/lib/auth";
import { firestore, storage } from "@/lib/firebase_config";
import { FirestoreGroup, Result } from "@/lib/types";
import { collection, doc, FirestoreError, getDoc, getDocs, query, runTransaction, serverTimestamp, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

async function upload_group_icon(group_id: string, image_uri: string): Promise<Result<string>> {
    try {
        const response = await fetch(image_uri);
        const blob = await response.blob();

        const storage_ref = ref(storage, `group_icons/${group_id}.jpg`);

        await uploadBytes(storage_ref, blob);

        const download_url = await getDownloadURL(storage_ref);

        return { ok: true, data: download_url };
    } catch (error) {
        console.error("Error uploading group icon:", error);
        return { ok: false, error: "Failed to upload group icon", code: "upload_failed" };
    }
}

export async function create_group(
    group_name: string,
    group_icon_uri: string
): Promise<Result<string>> {
    try {
        const user = require_user();

        const join_code = await generate_join_code();

        const groups_ref = collection(firestore, "Groups");
        const doc_ref = doc(groups_ref);
        await setDoc(doc_ref, {
            uid: doc_ref.id,
            createdAt: serverTimestamp(),
            members: [user.uid],
            join_code,
            group_name,
            group_icon: group_icon_uri,
        });

        // let group_icon_url = "";
        // if (group_icon_uri) {
        //     const upload_result = await upload_group_icon(doc_ref.id, group_icon_uri);
        //     if (upload_result.ok) {
        //         group_icon_url = upload_result.data;
                
        //         await setDoc(doc_ref, { group_icon: group_icon_url }, { merge: true });
        //     }
        // }

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

export async function get_group(uid: string): Promise<Result<FirestoreGroup>> {
    try {
        const group_ref = doc(firestore, "Groups", uid);
        const group_snap = await getDoc(group_ref);

        if (!group_snap.exists()) {
            return { ok: false, error: "Group does not exist", code: "no_group" };
        }

        return { ok: true, data: group_snap.data() as FirestoreGroup };
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