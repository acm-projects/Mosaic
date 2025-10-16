import { LoadingPopup } from "@/components/loading_popup";
import { TwinklingStar } from "@/components/twinkle_star";
import { auth } from "@/lib/firebase_config";
import { add_quiz } from "@/lib/firebase_firestore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { MotiText, MotiView } from "moti";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const genres = [
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
];

const moods = [
    {
        id: "intensity",
        label: "How intense do you like it?",
        options: [
            { text: "Chill", emoji: "😌" },
            { text: "Balanced", emoji: "⚖️" },
            { text: "Intense", emoji: "🔥" },
        ],
    },
    {
        id: "tone",
        label: "What's your vibe?",
        options: [
            { text: "Light & Funny", emoji: "😂" },
            { text: "Mixed", emoji: "🎭" },
            { text: "Dark & Serious", emoji: "🌙" },
        ],
    },
    {
        id: "pace",
        label: "Preferred pacing?",
        options: [
            { text: "Slow Burn", emoji: "🕯️" },
            { text: "Moderate", emoji: "🚶" },
            { text: "Fast-Paced", emoji: "⚡" },
        ],
    },
];

export default function QuizScreen() {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [moodAnswers, setMoodAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const stars = useMemo(
        () =>
            [...Array(50)].map((_, i) => ({
                key: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                animation_delay: Math.random() * 3,
            })),
        []
    );

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) => {
            if (prev.includes(genre)) return prev.filter((g) => g !== genre);
            if (prev.length < 3) return [...prev, genre];
            return prev;
        });
    };

    const handleContinue = () => {
        if (step === 1 && selectedGenres.length === 3) setStep(2);
        if (step === 2 && Object.keys(moodAnswers).length === moods.length) handle_finish();
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
    };

    function handle_finish() {
        setLoading(true);

        const user = auth.currentUser;
        add_quiz(user?.uid!, selectedGenres, moodAnswers).then((result) => {
            setLoading(false);
            if (result === true) {
                router.replace("/home");
            } else {
                alert("Error: " + result);
            }
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Gradient Background */}
            <LinearGradient
                colors={["#000000", "#0f172a", "#1e1b4b"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Twinkling Stars */}
            <View style={styles.star_container}>
                {stars.map((star) => (
                    <TwinklingStar
                        key={star.key}
                        left={star.left}
                        top={star.top}
                        animation_delay={star.animation_delay}
                    />
                ))}
            </View>

            <LoadingPopup visible={loading}/>

            {/* Content */}
            <View style={styles.contentContainer}>
                {/* Back Button */}
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={22} color="white" />
                </TouchableOpacity>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={[styles.stepBox, step === 1 && styles.activeStep]}>
                        <View
                            style={[
                                styles.stepCircle,
                                step === 1 ? styles.activeCircle : styles.inactiveCircle,
                            ]}
                        />
                        <Text style={styles.stepLabel}>Genres</Text>
                    </View>
                    <View style={[styles.stepBox, step === 2 && styles.activeStep]}>
                        <View
                            style={[
                                styles.stepCircle,
                                step === 2 ? styles.activeCircle : styles.inactiveCircle,
                            ]}
                        />
                        <Text style={styles.stepLabel}>Mood</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{
                            type: "timing",
                            duration: 800,
                            easing: Easing.bezier(0.23, 1, 0.32, 1),
                        }}
                    >
                        {step === 1 ? (
                            <>
                                <View style={styles.titleContainer}>
                                    <MotiText
                                        from={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 200 }}
                                        style={styles.title}
                                    >
                                        What do you love watching?
                                    </MotiText>
                                    <Text style={styles.subtitle}>Select exactly 3 genres</Text>
                                </View>

                                <View style={styles.genresContainer}>
                                    {genres.map((genre) => {
                                        const selected = selectedGenres.includes(genre.name);
                                        return (
                                            <TouchableOpacity
                                                key={genre.name}
                                                onPress={() => toggleGenre(genre.name)}
                                                style={[
                                                    styles.genreButton,
                                                    selected && styles.genreSelected,
                                                ]}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.genreEmoji}>{genre.emoji}</Text>
                                                <Text style={styles.genreLabel}>{genre.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.titleContainer}>
                                    <MotiText style={styles.title}>Set your preferences</MotiText>
                                    <Text style={styles.subtitle}>
                                        Help us personalize your experience
                                    </Text>
                                </View>

                                <View style={styles.moodsContainer}>
                                    {moods.map((mood) => (
                                        <View key={mood.id} style={styles.moodSection}>
                                            <Text style={styles.moodLabel}>{mood.label}</Text>
                                            <View style={styles.moodOptions}>
                                                {mood.options.map((option) => {
                                                    const selected =
                                                        moodAnswers[mood.id] === option.text;
                                                    return (
                                                        <TouchableOpacity
                                                            key={option.text}
                                                            onPress={() =>
                                                                setMoodAnswers({
                                                                    ...moodAnswers,
                                                                    [mood.id]: option.text,
                                                                })
                                                            }
                                                            style={[
                                                                styles.moodButton,
                                                                selected && styles.moodSelected,
                                                            ]}
                                                        >
                                                            <Text style={styles.moodEmoji}>
                                                                {option.emoji}
                                                            </Text>
                                                            <Text style={styles.moodText}>
                                                                {option.text}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </MotiView>

                    {/* Continue Button */}
                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={
                            (step === 1 && selectedGenres.length !== 3) ||
                            (step === 2 && Object.keys(moodAnswers).length < moods.length)
                        }
                        activeOpacity={1}
                    >
                        <LinearGradient
                            colors={
                                (step === 1 && selectedGenres.length === 3) ||
                                    (step === 2 && Object.keys(moodAnswers).length === moods.length)
                                    ? ["#4f46e5", "#6366f1"]
                                    : ["#27272a", "#3f3f46"]
                            }
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.continueButton}
                        >
                            <Text style={styles.continueText}>
                                {step === 1
                                    ? `Continue (${selectedGenres.length}/3)`
                                    : "Continue"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    star_container: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        zIndex: 10,
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
        zIndex: 20,
        borderWidth: 1,
        borderColor: "#334155",
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
        borderColor: "#6366f1",
    },
    stepCircle: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    activeCircle: { backgroundColor: "#6366f1" },
    inactiveCircle: { backgroundColor: "#475569" },
    stepLabel: { color: "white", fontSize: 12, fontWeight: "500" },
    titleContainer: { alignItems: "center", marginBottom: 24 },
    title: { color: "white", fontSize: 24, fontWeight: "700", textAlign: "center" },
    subtitle: { color: "#94A3B8", fontSize: 14, textAlign: "center", marginTop: 4 },
    genresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    genreButton: {
        width: "30%",
        aspectRatio: 1,
        backgroundColor: "rgba(30,41,59,0.4)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        position: "relative",
    },
    genreSelected: {
        backgroundColor: "rgba(79,70,229,0.3)",
        borderColor: "#6366f1",
    },
    genreEmoji: { fontSize: 24 },
    genreLabel: { fontSize: 12, color: "white", marginTop: 4 },
    checkCircle: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#4f46e5",
        justifyContent: "center",
        alignItems: "center",
    },
    moodsContainer: { marginTop: 16 },
    moodSection: { marginBottom: 24 },
    moodLabel: {
        color: "#CBD5E1",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 8,
    },
    moodOptions: { flexDirection: "row", justifyContent: "space-between" },
    moodButton: {
        flex: 1,
        backgroundColor: "rgba(30,41,59,0.4)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        paddingVertical: 12,
        marginHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    moodSelected: {
        backgroundColor: "rgba(79,70,229,0.3)",
        borderColor: "#6366f1",
    },
    moodEmoji: { fontSize: 24 },
    moodText: { fontSize: 12, color: "white", marginTop: 4 },
    continueButton: {
        borderRadius: 12,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    continueText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
