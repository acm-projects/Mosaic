import { MaterialIcons } from "@expo/vector-icons"; // Check
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const genres = [
    { name: 'Action', emoji: '💥' },
    { name: 'Comedy', emoji: '😂' },
    { name: 'Drama', emoji: '🎭' },
    { name: 'Horror', emoji: '👻' },
    { name: 'Sci-Fi', emoji: '🚀' },
    { name: 'Romance', emoji: '❤️' },
    { name: 'Thriller', emoji: '😱' },
    { name: 'Animation', emoji: '🎨' },
    { name: 'Documentary', emoji: '📹' },
    { name: 'Fantasy', emoji: '🧙' },
    { name: 'Mystery', emoji: '🔍' },
    { name: 'Adventure', emoji: '🗺️' }
];

const moods = [
    {
        id: 'intensity',
        label: 'How intense do you like it?',
        options: [
            { text: 'Chill', emoji: '😌' },
            { text: 'Balanced', emoji: '⚖️' },
            { text: 'Intense', emoji: '🔥' }
        ]
    },
    {
        id: 'tone',
        label: "What's your vibe?",
        options: [
            { text: 'Light & Funny', emoji: '😂' },
            { text: 'Mixed', emoji: '🎭' },
            { text: 'Dark & Serious', emoji: '🌙' }
        ]
    },
    {
        id: 'pace',
        label: 'Preferred pacing?',
        options: [
            { text: 'Slow Burn', emoji: '🕯️' },
            { text: 'Moderate', emoji: '🚶' },
            { text: 'Fast-Paced', emoji: '⚡' }
        ]
    }
];

export default function QuizScreen() {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [moodAnswers, setMoodAnswers] = useState<Record<string, string>>({});

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => {
            if (prev.includes(genre)) return prev.filter(g => g !== genre);
            if (prev.length < 3) return [...prev, genre];
            return prev;
        });
    };

    const handleContinue = () => {
        if (step === 1 && selectedGenres.length === 3) {
            setStep(2);
        } else if (step === 2 && Object.keys(moodAnswers).length === moods.length) {
        }
    };

    const handleBack = () => {
        if (step === 1) {
            
        } else {
            setStep(1);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <View style={[styles.stepBox, step === 1 && styles.activeStep]}>
                    <View style={[styles.stepCircle, step === 1 ? styles.activeCircle : styles.inactiveCircle]} />
                    <Text style={styles.stepLabel}>Genres</Text>
                </View>
                <View style={[styles.stepBox, step === 2 && styles.activeStep]}>
                    <View style={[styles.stepCircle, step === 2 ? styles.activeCircle : styles.inactiveCircle]} />
                    <Text style={styles.stepLabel}>Mood</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {step === 1 ? (
                    <>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>What do you love watching?</Text>
                            <Text style={styles.subtitle}>Select exactly 3 genres</Text>
                        </View>
                        <View style={styles.genresContainer}>
                            {genres.map(genre => {
                                const selected = selectedGenres.includes(genre.name);
                                return (
                                    <TouchableOpacity key={genre.name} onPress={() => toggleGenre(genre.name)} style={[styles.genreButton, selected && styles.genreSelected]}>
                                        <Text style={styles.genreEmoji}>{genre.emoji}</Text>
                                        <Text style={styles.genreLabel}>{genre.name}</Text>
                                        {selected && (
                                            <View style={styles.checkCircle}>
                                                <MaterialIcons name="check" size={18} color="white" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Set your preferences</Text>
                            <Text style={styles.subtitle}>Help us personalize your experience</Text>
                        </View>
                        <View style={styles.moodsContainer}>
                            {moods.map(mood => (
                                <View key={mood.id} style={styles.moodSection}>
                                    <Text style={styles.moodLabel}>{mood.label}</Text>
                                    <View style={styles.moodOptions}>
                                        {mood.options.map(option => {
                                            const selected = moodAnswers[mood.id] === option.text;
                                            return (
                                                <TouchableOpacity key={option.text} onPress={() => setMoodAnswers({ ...moodAnswers, [mood.id]: option.text })} style={[styles.moodButton, selected && styles.moodSelected]}>
                                                    <Text style={styles.moodEmoji}>{option.emoji}</Text>
                                                    <Text style={styles.moodText}>{option.text}</Text>
                                                    {selected && (
                                                        <View style={styles.checkCircle}>
                                                            <MaterialIcons name="check" size={18} color="white" />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={(step === 1 && selectedGenres.length !== 3) || (step === 2 && Object.keys(moodAnswers).length < moods.length)}
                    style={[styles.continueButton, ((step === 1 && selectedGenres.length === 3) || (step === 2 && Object.keys(moodAnswers).length === moods.length)) ? {} : styles.disabledButton]}
                >
                    <Text style={styles.continueText}>{step === 1 ? `Continue (${selectedGenres.length}/3)` : 'Continue'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', paddingTop: 60, paddingHorizontal: 16 },
    backButton: { position: 'absolute', top: 20, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
    progressContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
    stepBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    activeStep: { backgroundColor: '#5C7AB8', borderColor: '#5C7AB8' },
    stepCircle: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    activeCircle: { backgroundColor: 'white' },
    inactiveCircle: { backgroundColor: 'gray' },
    stepLabel: { color: 'white', fontSize: 12, fontWeight: '500' },
    scrollContainer: { paddingBottom: 40 },
    titleContainer: { alignItems: 'center', marginBottom: 24 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginTop: 4 },
    genresContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    genreButton: { width: '30%', aspectRatio: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' },
    genreSelected: { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.4)' },
    genreEmoji: { fontSize: 24 },
    genreLabel: { fontSize: 12, color: 'white', textAlign: 'center', marginTop: 4 },
    checkCircle: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#5C7AB8', justifyContent: 'center', alignItems: 'center' },
    moodsContainer: { marginTop: 16 },
    moodSection: { marginBottom: 24 },
    moodLabel: { color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: 8 },
    moodOptions: { flexDirection: 'row', justifyContent: 'space-between' },
    moodButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    moodSelected: { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.4)' },
    moodEmoji: { fontSize: 24 },
    moodText: { fontSize: 12, color: 'white', marginTop: 4, textAlign: 'center' },
    continueButton: { height: 48, borderRadius: 12, backgroundColor: '#7B9ED9', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
    disabledButton: { opacity: 0.6 },
    continueText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
