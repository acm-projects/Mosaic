import GridOptionSelector from "@/components/grid_option_selector";
import LoadingPopup from "@/components/loading_popup";
import MoodSelector from "@/components/mood_selector";
import PageBackground from "@/components/page_background";
import { require_user, sign_out } from "@/lib/auth";
import { add_quiz } from "@/lib/firestore/users";
import { theme } from "@/lib/styles";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { LogOut } from "lucide-react-native";
import { MotiText, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const GENRES = [
    { name: "Action", emoji: "💥" },
    { name: "Comedy", emoji: "😂" },
    { name: "Drama", emoji: "🎭" },
    { name: "Horror", emoji: "👻" },
    { name: "Sci-Fi", emoji: "🚀" },
    { name: "Romance", emoji: "❤️" },
    { name: "Thriller", emoji: "😱" },
    { name: "Animation", emoji: "🎨" },
    { name: "Documentary", emoji: "📹" },
    { name: "Fantasy", emoji: "🧙" },
    { name: "Mystery", emoji: "🔍" },
    { name: "Adventure", emoji: "🗺️" },
]

const STREAMING_PROVIDERS = [
    { name: "Netflix", emoji: "N", color: "#E50914" },
    { name: "Disney+", emoji: "D+", color: "#113CCF" },
    { name: "HBO Max", emoji: "HBO", color: "#6C5CE7" },
    { name: "Amazon Prime", emoji: "P", color: "#00A8E1" },
    { name: "Hulu", emoji: "H", color: "#1CE783" },
    { name: "Apple TV+", emoji: "TV+", color: "#000000" },
    { name: "Paramount+", emoji: "P+", color: "#0064FF" },
    { name: "Peacock", emoji: "P", color: "#6C2C91" },
    { name: "Showtime", emoji: "SHO", color: "#FF0000" },
]

export default function QuizScreen() {
    const [step, set_step] = useState(1);
    const [selected_genres, set_selected_genres] = useState<string[]>([]);
    const [mood_answers, set_mood_answers] = useState<Record<string, string>>({});
    const [selected_providers, set_selected_providers] = useState<string[]>([]);
    const [loading, set_loading] = useState(false);
    const [unlocked_steps, set_unlocked_steps] = useState([1]);

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK') {
                e.preventDefault();
            }
        });

        return unsubscribe;
    }, [navigation]);

    function toggle_genre(genre: string) {
        set_selected_genres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    }

    function toggle_provider(provider: string) {
        set_selected_providers((prev) =>
            prev.includes(provider)
                ? prev.filter((p) => p !== provider)
                : [...prev, provider]
        );
    }

    function handle_continue() {
        if (step === 1 && selected_genres.length >= 3) {
            set_unlocked_steps([1, 2]);
            set_step(2);
        } else if (step === 2 && Object.keys(mood_answers).length === 3) {
            set_unlocked_steps([1, 2, 3]);
            set_step(3);
        } else if (step === 3) {
            handle_finish();
        }
    }

    function handle_skip() {
        if (step === 3) {
            handle_finish();
        }
    }

    async function handle_finish() {
        try {
            set_loading(true);
            const user = require_user();
            const result = await add_quiz(user.uid, selected_genres, mood_answers, selected_providers);

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

    const continue_disabled = (step === 1 && selected_genres.length < 3) || (step === 2 && Object.keys(mood_answers).length < 3);

    return (
        <SafeAreaView style={styles.container}>
            <PageBackground />
            <LoadingPopup visible={loading} />

            <View style={styles.back_button}>
                <LogOut
                    size={24}
                    color={"white"}
                    onPress={async () => {
                        await sign_out();
                        router.replace("/auth/login");
                    }}
                />
            </View>

            {/* Progress */}
            <View style={styles.progress_container}>
                {["Genres", "Mood", "Providers"].map((label, i) => {
                    const index = i + 1;
                    const active = step === index;
                    const unlocked = unlocked_steps.includes(index);

                    return (
                        <TouchableOpacity
                            key={label}
                            disabled={!unlocked}
                            onPress={() => unlocked && set_step(index)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.step_box, active && styles.active_step, !unlocked && { opacity: 0.4 }]}>
                                <View
                                    style={[
                                        styles.step_circle,
                                        active ? styles.active_circle : styles.inactive_circle
                                    ]}
                                />
                                <Text style={styles.step_label}>{label}</Text>
                            </View>
                        </TouchableOpacity>
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
                                <Text style={styles.subtitle}>
                                    Select at least 3 genres
                                </Text>
                            </View>

                            <GridOptionSelector
                                options={GENRES}
                                selected={selected_genres}
                                toggle={toggle_genre}
                            />
                        </>
                    ) : step === 2 ? (
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
                    ) : (
                        <>
                            <View style={styles.title_container}>
                                <MotiText style={styles.title}>
                                    Where do you watch?
                                </MotiText>
                                <Text style={styles.subtitle}>
                                    Select your streaming providers (optional)
                                </Text>
                            </View>

                            <GridOptionSelector
                                options={STREAMING_PROVIDERS}
                                selected={selected_providers}
                                toggle={toggle_provider}
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
                                ? `Continue (${selected_genres.length}/3${selected_genres.length > 3 ? '+' : ''})`
                                : step === 2
                                    ? "Continue"
                                    : selected_providers.length > 0
                                        ? `Continue (${selected_providers.length} selected)`
                                        : "Continue"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {step === 3 && (
                    <TouchableOpacity
                        onPress={handle_skip}
                        activeOpacity={0.7}
                        style={styles.skip_button}
                    >
                        <Text style={styles.skip_text}>
                            Skip for now
                        </Text>
                    </TouchableOpacity>
                )}
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
        right: theme.spacing.xxl,
        zIndex: 20,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.border_radius.full,
        padding: theme.spacing.md,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
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
    skip_button: {
        marginTop: theme.spacing.lg,
        paddingVertical: theme.spacing.lg,
        alignItems: "center",
    },
    skip_text: {
        color: theme.colors.text.muted,
        fontSize: 14,
        fontWeight: "500",
    },
});