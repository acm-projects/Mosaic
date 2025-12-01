import { MovieDetails } from "@/lib/types";
import { router } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export default function SearchMovieCard({ movie }: { movie: MovieDetails }) {
    const poster_url = movie.poster_path
        ? `${TMDB_IMAGE_BASE}w500${movie.poster_path}`
        : null;

    return (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => router.navigate(`/movie/${movie.id}`)}
            activeOpacity={0.9}
        >
            {/* Movie Image */}
            <View style={styles.imageContainer}>
                {poster_url ? (
                    <Image
                        source={{ uri: poster_url }}
                        style={styles.movieImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.movieImage, styles.placeholderImage]} />
                )}

                <View style={styles.imageOverlay} />

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        // Add bookmark logic here
                    }}
                >
                    <Bookmark
                        size={20}
                        color="#fff"
                        fill={'none'}
                    />
                </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.title}
                </Text>

                <View style={styles.movieMeta}>
                    <Text style={styles.metaText}>
                        {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}
                    </Text>
                    {movie.runtime > 0 && (
                        <>
                            <Text style={styles.metaDot}>•</Text>
                            <Text style={styles.metaText}>{movie.runtime} min</Text>
                        </>
                    )}
                    {movie.vote_average > 0 && (
                        <>
                            <Text style={styles.metaDot}>•</Text>
                            <Text style={[styles.metaText, { color: '#facc15' }]}>
                                ★ {movie.vote_average.toFixed(1)}
                            </Text>
                        </>
                    )}
                </View>

                {movie.genres && movie.genres.length > 0 && (
                    <View style={styles.genreTags}>
                        {movie.genres.slice(0, 3).map((g: { id: number; name: string }) => (
                            <View key={g.id} style={styles.genreTag}>
                                <Text style={styles.genreTagText}>{g.name}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    movieCard: {
        backgroundColor: '#ffffff10',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ffffff20',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 160,
    },
    movieImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: '#1a1a1a',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    iconButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    infoContainer: {
        padding: 12,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 6,
        lineHeight: 20,
    },
    movieMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    metaText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
    },
    metaDot: {
        color: '#ffffff60',
        marginHorizontal: 4,
        fontSize: 12,
    },
    genreTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    genreTag: {
        backgroundColor: '#818cf8',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    genreTagText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
});