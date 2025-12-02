import { auth } from '@/lib/firebase_config';
import { get_user_data, new_user } from '@/lib/firestore/users';
import { Result } from '@/lib/types';
import { AuthError, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, User } from 'firebase/auth';
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

export async function google_sign_in(id_token: string, user_name?: string): Promise<Result<{ user: User; is_new_user: boolean }>> {
    try {
        const credential = GoogleAuthProvider.credential(id_token);

        const user_creds = await signInWithCredential(auth, credential);
        const user = user_creds.user;

        const user_data_result = await get_user_data(user.uid);

        let is_new_user = false;

        // If user doesn't exist, create new user document
        if (!user_data_result.ok) {
            // Extract username from provided name, displayName, or email
            const username = user_name || user.displayName || user.email?.split('@')[0] || 'user';

            const new_user_result = await new_user(user.uid, user.email!, username);

            if (!new_user_result.ok) {
                return {
                    ok: false,
                    error: new_user_result.error,
                    code: new_user_result.code || 'firestore-error'
                };
            }

            is_new_user = true;
        }

        return {
            ok: true,
            data: { user, is_new_user }
        };
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

export function sign_out(): Promise<void> {
    return auth.signOut();
}
