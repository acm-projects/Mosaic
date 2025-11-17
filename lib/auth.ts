import { auth } from '@/lib/firebase_config';
import { new_user } from '@/lib/firestore/users';
import { Result } from '@/lib/types';
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { FirestoreError } from 'firebase/firestore';

export async function login(email: string, password: string): Promise<Result<User>> {
    try {
        const user_creds = await signInWithEmailAndPassword(auth, email, password);

        return { ok: true, data: user_creds.user };
    } catch (error) {
        let error_message = "An unknown error occurred.";
        let error_code = "unknown";

        if ((error as AuthError).code) {
            error_code = (error as AuthError).code;
            error_message = (error as AuthError).message;
        }

        return { ok: false, error: error_message, code: error_code };
    }
}

export async function sign_up(email: string, password: string, username: string): Promise<Result<User>> {
    try {
        const user_creds = await createUserWithEmailAndPassword(auth, email, password);
        await new_user(user_creds.user.uid, user_creds.user.email!, username);

        return { ok: true, data: user_creds.user };
    } catch (error) {
        let error_code = "unknown";
        let error_message = "An unknown error occurred.";

        if ((error as AuthError).code) {
            error_message = (error as AuthError).message;
            error_code = (error as AuthError).code;
        } else if ((error as FirestoreError).code) {
            error_message = (error as FirestoreError).message;
            error_code = (error as FirestoreError).code;
        }

        return { ok: false, error: error_message, code: error_code };
    }
}

export function require_user(): User {
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    return user;
}
