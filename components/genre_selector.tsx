import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    selected: string[];
    toggle: (genre: string) => void;
}

const GENRES = [
    "Action", "Comedy", "Drama", "Horror", "Sci-Fi",
    "Romance", "Thriller", "Animation", "Documentary",
    "Fantasy", "Mystery", "Adventure",
].map((name) => ({
    name,
    emoji: {
        Action: "💥", Comedy: "😂", Drama: "🎭", Horror: "👻",
        "Sci-Fi": "🚀", Romance: "❤️", Thriller: "😱", Animation: "🎨",
        Documentary: "📹", Fantasy: "🧙", Mystery: "🔍", Adventure: "🗺️",
    }[name],
}));

export default function GenreSelector({ selected, toggle }: Props) {
    return (
        <View style={styles.grid}>
            {GENRES.map((g: any) => {
                const is_selected = selected.includes(g.name);
                return (
                    <TouchableOpacity
                        key={g.name}
                        onPress={() => toggle(g.name)}
                        style={[styles.option_box, is_selected && styles.option_selected]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.option_emoji}>{g.emoji}</Text>
                        <Text style={styles.option_label}>{g.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    option_box: {
        width: "30%",
        aspectRatio: 1,
        backgroundColor: "rgba(30,41,59,0.4)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    option_selected: { backgroundColor: "rgba(79,70,229,0.3)", borderColor: "#6366f1" },
    option_emoji: { fontSize: 24 },
    option_label: { fontSize: 12, color: "white", marginTop: 4 },
});