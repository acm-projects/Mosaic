import { MovieDetails } from "@/lib/types";
import { Bookmark, Heart } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchMovieCard({ movie }: { movie: MovieDetails }) {
    return (
        <View style={styles.movieCard}>
            {/* Movie Image */}
            <TouchableOpacity activeOpacity={0.8}>
                <Image
                    source={{ uri: "https://image.tmdb.org/t/p/w500/28kKbSUvUz6P5RE1AuMJMO7IMfK.jpg" }}
                    style={styles.movieImage}
                    resizeMode="cover"
                />
                <View style={styles.imageOverlay} />

                {/* Match Badge */}
                <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>
                        80% Match
                    </Text>
                </View>

                {/* Like Button */}
                <TouchableOpacity style={[styles.iconButton, { right: 52 }]}>
                    <Heart
                        size={20}
                        color={'#fff'}
                        fill={'none'}
                    />
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity style={[styles.iconButton, { right: 10 }]}>
                    <Bookmark
                        size={20}
                        color="#fff"
                        fill={'none'}
                    />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <View style={styles.movieMeta}>
                    <Text style={styles.metaText}>{movie.release_date.slice(0, 4)}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{movie.runtime} min</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={[styles.metaText, { color: '#FFD700' }]}>
                        ★ {movie.vote_average.toFixed(1)}
                    </Text>
                </View>

                <Text style={styles.movieDesc} numberOfLines={3}>
                    Description here
                </Text>

                <View style={styles.genreTags}>
                    {movie.genres.map((g: { id: number; name: string }) => (
                        <View key={g.id} style={styles.genreTag}>
                            <Text style={styles.genreTagText}>{g.name}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.platformContainer}>
                    <Text style={styles.platformLabel}>Available on:</Text>
                    <View style={styles.platformList}>
                        <View style={styles.platformTag}>
                            <Text style={styles.platformText}>Netflix</Text>
                        </View>
                        <View style={styles.platformTag}>
                            <Text style={styles.platformText}>Hulu</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    movieCard: {
        backgroundColor: '#0a0a1a',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    movieImage: {
        width: '100%',
        height: '56%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    matchBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchText: {
        color: '#fff',
        fontSize: 10,
    },
    iconButton: {
        position: 'absolute',
        top: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        padding: 12,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    movieMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaText: {
        color: '#aaa',
        fontSize: 12,
    },
    metaDot: {
        color: '#666',
        marginHorizontal: 4,
    },
    movieDesc: {
        color: '#bbb',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 8,
    },
    genreTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 8,
    },
    genreTag: {
        backgroundColor: '#2a2a4a',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    genreTagText: {
        color: '#ccc',
        fontSize: 11,
    },
    platformContainer: {
        marginTop: 4,
    },
    platformLabel: {
        color: '#888',
        fontSize: 11,
        marginBottom: 4,
    },
    platformList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    platformTag: {
        backgroundColor: '#1a1a2e',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    platformText: {
        color: '#ccc',
        fontSize: 11,
    },
});