import { MotiView } from "moti";
import { StyleSheet } from "react-native";

interface TwinklingStarProps {
    left: number;
    top: number;
    animation_delay: number;
}

export function TwinklingStar({ left, top, animation_delay: animation_delay }: TwinklingStarProps) {
    const duration = 1000 + Math.random() * 2000;

    return (
        <MotiView
            from={{ opacity: 0.5 }}
            animate={{ opacity: 0.1 }}
            transition={{
                loop: true,
                type: "timing",
                duration,
                delay: animation_delay * 1000,
            }}
            style={[
                styles.star,
                {
                    left: `${left}%`,
                    top: `${top}%`,
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    star: {
        position: "absolute",
        width: 4,
        height: 4,
        backgroundColor: "white",
        borderRadius: 9999,
    },
});