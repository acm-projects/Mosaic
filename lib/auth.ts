import { auth } from '@/lib/firebase_config';
import { new_user } from '@/lib/firestore/users';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';

export function login(email: string, password: string): Promise<boolean | string> {
    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        auth.updateCurrentUser(userCredential.user);

        return true;
    }).catch((error) => {
        const error_code = error.code;
        const error_message = error.message;

        return error_message;
    });
}

export function sign_up(email: string, password: string, username: string): Promise<boolean | string> {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        auth.updateCurrentUser(userCredential.user);

        console.log(userCredential.user.uid);
        new_user(userCredential.user.uid, userCredential.user.email!, username);

        return true;
    }).catch((error) => {
        const error_code = error.code;
        const error_message = error.message;

        return error_message;
    });
}

export function require_user(): User {
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    return user;
}
