import MosaicLogo from "@/components/mosaic_logo";
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
                } else if (user_data.data.taken_quiz && user_data.data.favorite_movies.length > 0) {
                    router.replace("/home/(tabs)");
                } else {
                    if (!user_data.data.taken_quiz) {
                        router.replace("/onboarding/quiz");
                    } else {
                        router.replace("/onboarding/movie_tinder");
                    }
                }
                
            } else {
                router.replace("/auth/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <MosaicLogo size="lg" direction="column" show_subtitle={false} />
        </SafeAreaView>
    );
};
