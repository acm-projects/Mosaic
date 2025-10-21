import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    answers: { [key: string]: string };
    set_answers: (answers: { [key: string]: string }) => void;
}

const MOODS = [
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

export default function MoodSelector({ answers, set_answers }: Props) {
    return (
        <View>
            {MOODS.map((m: any) => (
                <View key={m.id} style={styles.mood_section}>
                    <Text style={styles.mood_label}>{m.label}</Text>
                    <View style={styles.mood_options}>
                        {m.options.map((opt: any) => {
                            const selected = answers[m.id] === opt.text;
                            return (
                                <TouchableOpacity
                                    key={opt.text}
                                    onPress={() => set_answers({ ...answers, [m.id]: opt.text })}
                                    style={[styles.mood_button, selected && styles.option_selected]}
                                >
                                    <Text style={styles.option_emoji}>{opt.emoji}</Text>
                                    <Text style={styles.option_label}>{opt.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    option_selected: {
        backgroundColor: "rgba(79,70,229,0.3)",
        borderColor: "#6366f1",
    },
    option_emoji: {
        fontSize: 24,
    },
    option_label: {
        fontSize: 12,
        color: "white",
        marginTop: 4,
    },
    mood_section: {
        marginBottom: 24,
    },
    mood_label: {
        color: "#CBD5E1",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 8,
    },
    mood_options: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mood_button: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        alignItems: "center",
        justifyContent: "center",
    },
});