import { theme } from "@/lib/styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Option {
    name: string;
    emoji: string;
    color?: string;
}

interface Props {
    options: Option[];
    selected: string[];
    toggle: (value: string) => void;
}

export default function GridOptionSelector({ options, selected, toggle }: Props) {
    return (
        <View style={styles.grid}>
            {options.map((option) => {
                const is_selected = selected.includes(option.name);
                return (
                    <TouchableOpacity
                        key={option.name}
                        onPress={() => toggle(option.name)}
                        style={[styles.option_box, is_selected && styles.option_selected]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.option_emoji, option.color && { color: option.color }]}>{option.emoji}</Text>
                        <Text style={styles.option_label}>{option.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: theme.spacing.lg,
    },
    option_box: {
        width: "30%",
        aspectRatio: 1,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.border_radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        alignItems: "center",
        justifyContent: "center",
    },
    option_selected: {
        backgroundColor: "rgba(79,70,229,0.3)",
        borderColor: theme.colors.border.accent,
        shadowColor: theme.colors.border.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    option_emoji: {
        fontSize: 24,
        marginBottom: theme.spacing.xs,
    },
    option_label: {
        fontSize: 12,
        color: theme.colors.text.primary,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: theme.spacing.md,
    },
});