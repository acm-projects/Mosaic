import { Heart, RotateCcw, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export default function MovieCard({ onSwipe }: { onSwipe?: (dir: "left" | "right" | "skip") => void }) {
    const position = useRef(new Animated.ValueXY()).current;
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "skip" | null>(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });

                if (gesture.dx > 30) setSwipeDirection("right");
                else if (gesture.dx < -30) setSwipeDirection("left");
                else if (gesture.dy < -30) setSwipeDirection("skip");
                else setSwipeDirection(null);
            },
            onPanResponderRelease: (_, gesture) => {
                let direction: "left" | "right" | "skip" | null = null;

                if (gesture.dx > SWIPE_THRESHOLD) direction = "right";
                else if (gesture.dx < -SWIPE_THRESHOLD) direction = "left";
                else if (gesture.dy < -SWIPE_THRESHOLD / 2) direction = "skip";

                if (direction) {
                    Animated.timing(position, {
                        toValue:
                            direction === "right"
                                ? { x: width + 200, y: gesture.dy }
                                : direction === "left"
                                ? { x: -width - 200, y: gesture.dy }
                                : { x: 0, y: -600 },
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        position.setValue({ x: 0, y: 0 });
                        setSwipeDirection(null);
                        onSwipe?.(direction);
                    });
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start(() => setSwipeDirection(null));
                }
            },
        })
    ).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
    });

    const cardStyle = {
        transform: [...position.getTranslateTransform(), { rotate }],
    };

    return (
        <View style={styles.cardContainer}>
            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.card, cardStyle]}
            >
                <Image
                    source={{ uri: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg" }}
                    style={styles.cardImage}
                />
                <View style={styles.gradientOverlay} />

                <View style={styles.cardInfo}>
                    <Text style={styles.movieTitle}>Inception</Text>
                    <Text style={styles.movieMeta}>2010 • Sci-Fi, Thriller</Text>
                    <View style={styles.movieDetails}>
                        <Text style={styles.rating}>★ 8.8</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.runtime}>148 min</Text>
                    </View>
                </View>

                {/* Swipe Indicators */}
                {swipeDirection === "left" && (
                    <View style={styles.indicatorContainer}>
                        <View style={[styles.indicator, styles.indicatorLeft]}>
                            <X size={64} color="#ef4444" />
                        </View>
                    </View>
                )}
                {swipeDirection === "right" && (
                    <View style={styles.indicatorContainer}>
                        <View style={[styles.indicator, styles.indicatorRight]}>
                            <Heart size={64} color="#22c55e" fill="#22c55e" />
                        </View>
                    </View>
                )}
                {swipeDirection === "skip" && (
                    <View style={styles.indicatorContainer}>
                        <View style={[styles.indicator, styles.indicatorSkip]}>
                            <RotateCcw size={64} color="#9ca3af" />
                        </View>
                    </View>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    card: {
        width: "75%",
        aspectRatio: 2 / 3,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 10,
        position: "relative",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    cardInfo: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    movieTitle: { color: "#fff", fontSize: 22, fontWeight: "600" },
    movieMeta: { color: "#d1d5db", fontSize: 14, marginTop: 4 },
    movieDetails: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    rating: { color: "#facc15", fontSize: 14 },
    dot: { color: "#9ca3af", marginHorizontal: 6 },
    runtime: { color: "#9ca3af", fontSize: 14 },
    indicatorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    indicatorLeft: {
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
    },
    indicatorRight: {
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
    },
    indicatorSkip: {
        borderColor: "#9ca3af",
        backgroundColor: "rgba(107,114,128,0.2)",
    },
});
