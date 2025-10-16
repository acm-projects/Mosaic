import { auth } from '@/lib/firebase_config';
import { get_user_data } from '@/lib/firebase_firestore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const user = auth.currentUser;
                const user_data = get_user_data(user!.uid);

                user_data.then((data) => {
                    if (typeof (data) == "object" && !data?.taken_quiz) {
                        router.replace("/quiz");
                    } else {
                        router.replace("/home");
                    }
                });
            } else {
                router.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4f46e5" />
        </View>
    );
}
