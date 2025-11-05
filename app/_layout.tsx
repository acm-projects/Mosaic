import { AppProvider } from '@/context/AppContext';
import { auth } from "@/lib/firebase_config";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
// import { get_user_data } from "@/lib/firebase_firestore";

export default function RootLayout() {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.replace("/home");
            } else {
                router.replace("/auth/login");
            }
        });

        return () => unsubscribe();
    }, []);
    
    return (
        <AppProvider>
            <Stack>
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
            </Stack>
        </AppProvider>
    );
}
