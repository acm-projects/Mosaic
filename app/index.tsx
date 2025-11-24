import MosaicLogo from "@/components/mosaic_logo";
import PageBackground from "@/components/page_background";
import { require_user } from "@/lib/auth";
import { auth } from "@/lib/firebase_config";
import { get_user_data } from "@/lib/firestore/users";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const user = require_user();
                const user_data = await get_user_data(user!.uid);

                if (!user_data.ok) {
                    Alert.alert("Error", user_data.error);
                } else if (user_data.data.taken_quiz) {
                    router.navigate("/home");
                } else {
                    router.navigate("/onboarding/quiz");
                }
                
            } else {
                router.navigate("/auth/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <PageBackground />

            <MosaicLogo size="lg" direction="column" show_subtitle={false} />
        </SafeAreaView>
    );
};
