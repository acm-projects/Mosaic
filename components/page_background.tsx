import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TwinklingStar } from "./twinkle_star";

export default function PageBackground() {
    const stars = useMemo(() =>
        [...Array(50)].map((_, i) => ({
            key: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animation_delay: Math.random() * 3
        })), []
    );

    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={["#000000", "#0f172a", "#1e1b4b"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

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
        </View>
    );
}

const styles = StyleSheet.create({
    star_container: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    }
});