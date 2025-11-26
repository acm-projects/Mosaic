import { use_swipe_card } from "@/lib/hooks/swipe_cards";
import { MovieDetails } from "@/lib/types";
import { Heart, RotateCcw, X } from "lucide-react-native";
import React from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

type Props = {
    movie_data: MovieDetails;
    on_swipe?: (dir: "left" | "right" | "skip") => void;
};

export default function MovieCard({ movie_data, on_swipe }: Props) {
    const { panHandlers, cardStyle, swipeDirection } = use_swipe_card(on_swipe);

    const year = movie_data.release_date?.slice(0, 4) ?? "";
    const genre_names = movie_data.genres.map((g) => g.name).join(", ");
    const runtime = movie_data.runtime ? `${movie_data.runtime} min` : "";
    const poster = `https://image.tmdb.org/t/p/w500${movie_data.poster_path}`;

    return (
        <View style={styles.cardContainer}>
            <Animated.View {...panHandlers} style={[styles.card, cardStyle]}>
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

                <SwipeIndicator direction={swipeDirection} />
            </Animated.View>
        </View>
    );
}

function SwipeIndicator({ direction }: { direction: "left" | "right" | "skip" | null }) {
    if (!direction) return null;

    const icon =
        direction === "left" ? (
            <X size={64} color="#ef4444" strokeWidth={3} />
        ) : direction === "right" ? (
            <Heart size={64} color="#22c55e" fill="#22c55e" strokeWidth={3} />
        ) : (
            <RotateCcw size={64} color="#9ca3af" strokeWidth={3} />
        );

    const style =
        direction === "left"
            ? styles.indicatorLeft
            : direction === "right"
                ? styles.indicatorRight
                : styles.indicatorSkip;

    return (
        <View style={styles.indicatorContainer} pointerEvents="none">
            <View style={[styles.indicator, style]}>{icon}</View>
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
        zIndex: 1,
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
        zIndex: 10,
    },
    indicator: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    indicatorLeft: {
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.3)",
    },
    indicatorRight: {
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.3)",
    },
    indicatorSkip: {
        borderColor: "#9ca3af",
        backgroundColor: "rgba(107,114,128,0.3)",
    },
});