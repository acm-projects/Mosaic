import { auth } from "@/lib/firebase_config";
import { get_user_data } from "@/lib/firebase_firestore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const user = auth.currentUser;
                const user_data = get_user_data(user!.uid);

                user_data.then((data) => {
                    if (typeof (data) == "object" && !data?.taken_quiz) {
                        router.navigate("/onboarding/quiz");
                    } else {
                        router.navigate("/home");
                    }
                });
            } else {
                // router.navigate("/onboarding/groups/");
            }
        });

        return () => unsubscribe();
    }, []);
    
    return (
        <Stack>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
    );
}
