import GenreSelector from "@/components/genre_selector";
import LoadingPopup from "@/components/loading_popup";
import MoodSelector from "@/components/mood_selector";
import PageBackground from "@/components/page_background";
import { require_user } from "@/lib/auth";
import { add_quiz } from "@/lib/firestore/users";
import { theme } from "@/lib/styles";
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
        set_selected_genres((prev) => 
            prev.includes(genre) 
                ? prev.filter((g) => g !== genre) 
                : (prev.length < 3 ? [...prev, genre] : prev)
        );
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
            const user = require_user();
            const result = await add_quiz(user.uid, selected_genres, mood_answers);

            if (result.ok) {
                router.navigate({
                    pathname: "/onboarding/movie_tinder",
                    params: { favorite_genres: JSON.stringify(selected_genres) }
                });
            } else {
                alert("Error: " + result.error);
            }
        } finally {
            set_loading(false);
        }
    }

    const continue_disabled = 
        (step === 1 && selected_genres.length !== 3) || 
        (step === 2 && Object.keys(mood_answers).length < 3);

    return (
        <SafeAreaView style={styles.container}>
            <PageBackground />
            <LoadingPopup visible={loading} />

            <ArrowLeft
                size={24}
                color={"white"}
                style={styles.back_button}
                onPress={() => router.back()}
            />

            {/* Progress */}
            <View style={styles.progress_container}>
                {["Genres", "Mood"].map((label, i) => {
                    const active = step === i + 1;
                    return (
                        <View key={label} style={[styles.step_box, active && styles.active_step]}>
                            <View
                                style={[
                                    styles.step_circle, 
                                    active ? styles.active_circle : styles.inactive_circle
                                ]}
                            />
                            <Text style={styles.step_label}>{label}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Content */}
            <ScrollView 
                contentContainerStyle={styles.scroll_content} 
                showsVerticalScrollIndicator={false}
            >
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
                            <View style={styles.title_container}>
                                <MotiText style={styles.title}>
                                    What do you love watching?
                                </MotiText>
                                <Text style={styles.subtitle}>Select 3 or more genres</Text>
                            </View>

                            <GenreSelector
                                selected={selected_genres}
                                toggle={toggle_genre}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.title_container}>
                                <MotiText style={styles.title}>
                                    Set your preferences
                                </MotiText>
                                <Text style={styles.subtitle}>
                                    Help us personalize your experience
                                </Text>
                            </View>

                            <MoodSelector
                                answers={mood_answers}
                                set_answers={set_mood_answers}
                            />
                        </>
                    )}
                </MotiView>

                <TouchableOpacity 
                    onPress={handle_continue} 
                    disabled={continue_disabled} 
                    activeOpacity={1}
                >
                    <LinearGradient
                        colors={(
                            continue_disabled 
                                ? theme.colors.gradient.disabled 
                                : theme.colors.gradient.primary
                        ) as [string, string, ...string[]]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.continue_button}
                    >
                        <Text style={styles.continue_text}>
                            {step === 1 
                                ? `Continue (${selected_genres.length}/3)` 
                                : "Continue"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        paddingHorizontal: theme.spacing.xxl,
        paddingTop: theme.spacing.giant
    },
    back_button: {
        position: "absolute",
        top: theme.spacing.massive,
        left: theme.spacing.xxl,
        zIndex: 20,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.border_radius.full
    },
    progress_container: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: theme.spacing.xl,
    },
    step_box: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.border_radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },
    active_step: {
        backgroundColor: "rgba(79,70,229,0.3)",
        borderColor: theme.colors.border.accent
    },
    step_circle: {
        width: 8,
        height: 8,
        borderRadius: theme.border_radius.xs,
        marginRight: theme.spacing.sm
    },
    active_circle: {
        backgroundColor: theme.colors.border.accent
    },
    inactive_circle: {
        backgroundColor: theme.colors.text.inactive
    },
    step_label: {
        color: theme.colors.text.primary,
        fontSize: 12,
        fontWeight: "500"
    },
    title_container: {
        alignItems: "center",
        marginBottom: theme.spacing.xxxl
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center"
    },
    subtitle: {
        color: theme.colors.text.tertiary,
        fontSize: 14,
        textAlign: "center",
        marginTop: theme.spacing.xs
    },
    scroll_content: { 
        paddingBottom: theme.spacing.giant 
    },
    continue_button: {
        borderRadius: theme.border_radius.sm,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing.xl
    },
    continue_text: {
        color: theme.colors.text.primary,
        fontWeight: "bold",
        fontSize: 16
    },
});