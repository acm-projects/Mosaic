import AmazonPrime from "@/assets/svg/amazon_prime.svg";
import AppleTV from "@/assets/svg/apple_tv.svg";
import DisneyPlus from "@/assets/svg/disney+.svg";
import HBOMax from "@/assets/svg/hbo_max.svg";
import Hulu from "@/assets/svg/hulu.svg";
import Netflix from "@/assets/svg/netflix.svg";
import ParamountPlus from "@/assets/svg/paramount+.svg";
import Peacock from "@/assets/svg/peacock.svg";
import Showtime from "@/assets/svg/showtime.svg";
import { theme } from "@/lib/styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Option {
    name: string;
    emoji?: string;
    svg?: boolean;
}

interface Props {
    options: Option[];
    selected: string[];
    toggle: (value: string) => void;
}

function render_logo(option: Option) {
    if (option.svg) {
        switch (option.name) {
            case "Netflix":
                return <Netflix width={48} height={48} />;
            case "Hulu":
                return <Hulu width={48} height={48} />;
            case "Disney+":
                return <DisneyPlus width={64} height={48} />;
            case "Apple TV+":
                return <AppleTV width={48} height={48} />;
            case "Amazon Prime":
                return <AmazonPrime width={48} height={48} />;
            case "HBO Max":
                return <HBOMax width={48} height={48} />;
            case "Paramount+":
                return <ParamountPlus width={48} height={48} />;
            case "Peacock":
                return <Peacock width={48} height={48} />;
            case "Showtime":
                return <Showtime width={48} height={48} />;
            default:
                return <Text style={{ fontSize: 24 }}>[UNAVAILABLE]</Text>;
        }
    } else {
        return <Text style={{ fontSize: 24 }}>{option.emoji}</Text>;
    }
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
                        {render_logo(option)}
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