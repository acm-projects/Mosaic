import GenreSelector from "@/components/genre_selector";
import LoadingPopup from "@/components/loading_popup";
import MoodSelector from "@/components/mood_selector";
import PageBackground from "@/components/page_background";
import { auth } from "@/lib/firebase_config";
import { add_quiz } from "@/lib/firebase_firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { MotiText, MotiView } from "moti";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
    const [step, set_step] = useState(1);
    const [selected_genres, set_selected_genres] = useState<string[]>([]);
    const [mood_answers, set_mood_answers] = useState<Record<string, string>>({});
    const [loading, set_loading] = useState(false);

    function toggle_genre(genre: string) {
        set_selected_genres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : (prev.length < 3 ? [...prev, genre] : prev));
    }

    function handle_continue() {
        if (step === 1 && selected_genres.length === 3) {
            set_step(2);
        } else if (step === 2 && Object.keys(mood_answers).length === 3) {
            handle_finish();
        }
    }

    async function handle_finish() {
        try {
            set_loading(true);
            const user = auth.currentUser;
            const result = await add_quiz(user?.uid!, selected_genres, mood_answers);
            if (result === true) router.navigate("/onboarding/groups");
            else alert("Error: " + result);
        } finally {
            set_loading(false);
        }
    }

    const continue_disabled = (step === 1 && selected_genres.length !== 3) || (step === 2 && Object.keys(mood_answers).length < 3);

    return (
        <SafeAreaView style={styles.container}>
            <PageBackground />
            <LoadingPopup visible={loading} />

            <ArrowLeft
                size={24}
                color={"white"}
                style={{
                    position: "absolute",
                    top: 40,
                    left: 20,
                    zIndex: 20,
                    backgroundColor: "rgba(30,41,59,0.5)",
                    borderRadius: 9999
                }}
                onPress={() => { router.back() }}
            />

            {/* Progress */}
            <View style={styles.progressContainer}>
                {["Genres", "Mood"].map((label, i) => {
                    const active = step === i + 1;
                    return (
                        <View key={label} style={[styles.stepBox, active && styles.activeStep]}>
                            <View
                                style={[styles.stepCircle, active ? styles.activeCircle : styles.inactiveCircle]}
                            />
                            <Text style={styles.stepLabel}>{label}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: "timing",
                        duration: 600,
                        easing: Easing.bezier(0.23, 1, 0.32, 1),
                    }}
                >
                    {step === 1 ? (
                        <>
                            <View style={styles.titleContainer}>
                                <MotiText style={styles.title}>What do you love watching?</MotiText>
                                <Text style={styles.subtitle}>Select 3 or more genres</Text>
                            </View>

                            <GenreSelector
                                selected={selected_genres}
                                toggle={toggle_genre}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.titleContainer}>
                                <MotiText style={styles.title}>Set your preferences</MotiText>
                                <Text style={styles.subtitle}>Help us personalize your experience</Text>
                            </View>

                            <MoodSelector
                                answers={mood_answers}
                                set_answers={set_mood_answers}
                            />
                        </>
                    )}
                </MotiView>

                <TouchableOpacity onPress={handle_continue} disabled={continue_disabled} activeOpacity={1}>
                    <LinearGradient
                        colors={
                            continue_disabled ? ["#27272a", "#3f3f46"] : ["#4f46e5", "#6366f1"]
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.continueButton}
                    >
                        <Text style={styles.continueText}>
                            {step === 1 ? `Continue (${selected_genres.length}/3)` : "Continue"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        position: "relative", 
        paddingHorizontal: 20, 
        paddingTop: 60 
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(30,41,59,0.5)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
        zIndex: 20,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 16,
    },
    stepBox: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    activeStep: { 
        backgroundColor: "rgba(79,70,229,0.3)", 
        borderColor: "#6366f1" 
    },
    stepCircle: { 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        marginRight: 6 
    },
    activeCircle: { 
        backgroundColor: "#6366f1" 
    },
    inactiveCircle: { 
        backgroundColor: "#475569" 
    },
    stepLabel: { 
        color: "white", 
        fontSize: 12, 
        fontWeight: "500" 
    },
    titleContainer: { 
        alignItems: "center", 
        marginBottom: 24 
    },
    title: { 
        color: "white", 
        fontSize: 24, 
        fontWeight: "700", 
        textAlign: "center" 
    },
    subtitle: { 
        color: "#94A3B8", 
        fontSize: 14, 
        textAlign: "center", 
        marginTop: 4 
    },
    grid: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        justifyContent: "space-between" 
    },
    continueButton: { 
        borderRadius: 12, 
        height: 48, 
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 16 
    },
    continueText: { 
        color: "white", 
        fontWeight: "bold", 
        fontSize: 16 
    },
});
