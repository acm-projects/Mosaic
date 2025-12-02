import { MovieDetails } from "@/lib/types";
import { Heart, RotateCcw, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

interface MovieCardProps {
    movie_data: MovieDetails;
    onSwipe?: (dir: "left" | "right" | "skip") => void;
}

export default function MovieCard({ movie_data, onSwipe }: MovieCardProps) {
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
                    handleSwipe(direction);
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start(() => setSwipeDirection(null));
                }
            },
        })
    ).current;

    const handleSwipe = (direction: "left" | "right" | "skip") => {
        setSwipeDirection(direction);

        Animated.timing(position, {
            toValue:
                direction === "right"
                    ? { x: width + 200, y: 0 }
                    : direction === "left"
                        ? { x: -width - 200, y: 0 }
                        : { x: 0, y: -600 },
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setSwipeDirection(null);
            onSwipe?.(direction);
        });
    };

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
    });

    const cardStyle = {
        transform: [...position.getTranslateTransform(), { rotate }],
    };

    const year = movie_data.release_date?.slice(0, 4) ?? "";
    const genre_names = movie_data.genres.map((g) => g.name).join(", ");
    const runtime = movie_data.runtime ? `${movie_data.runtime} min` : "";
    const poster = `https://image.tmdb.org/t/p/w500${movie_data.poster_path}`;

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Animated.View {...panResponder.panHandlers} style={[styles.card, cardStyle]}>
                    <Image source={{ uri: poster }} style={styles.cardImage} />
                    <View style={styles.gradientOverlay} />

                    <View style={styles.cardInfo}>
                        <Text style={styles.movieTitle}>{movie_data.title}</Text>
                        <Text style={styles.movieMeta}>
                            {year} • {genre_names}
                        </Text>
                        <View style={styles.movieDetails}>
                            <Text style={styles.rating}>★ {movie_data.vote_average.toFixed(1)}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.runtime}>{runtime}</Text>
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

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.dislikeButton]}
                    onPress={() => handleSwipe("left")}
                    activeOpacity={0.7}
                >
                    <X size={32} color="#ef4444" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.skipButton]}
                    onPress={() => handleSwipe("skip")}
                    activeOpacity={0.7}
                >
                    <RotateCcw size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={() => handleSwipe("right")}
                    activeOpacity={0.7}
                >
                    <Heart size={32} color="#22c55e" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
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
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        marginVertical: 20,
    },
    actionButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
    },
    dislikeButton: {
        width: 68,
        height: 68,
        backgroundColor: "#374151",
        borderWidth: 2,
        borderColor: "rgba(239,68,68,0.5)",
    },
    skipButton: {
        width: 52,
        height: 52,
        backgroundColor: "#374151",
        borderWidth: 2,
        borderColor: "rgba(156,163,175,0.5)",
    },
    likeButton: {
        width: 68,
        height: 68,
        backgroundColor: "#374151",
        borderWidth: 2,
        borderColor: "rgba(34,197,94,0.5)",
        shadowColor: "#22c55e",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
});