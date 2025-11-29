import { MovieDetails } from "@/lib/types";
import { Bookmark } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MovieCard({movie_details}: {movie_details: MovieDetails}) {
    return (
        <TouchableOpacity style={styles.movieCard}>
            <View style={styles.posterContainer}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${movie_details.poster_path}` }}
                    style={styles.posterImage}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => console.log("You should save this.")}
                >
                    <Bookmark
                        size={24}
                        color={"white"}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.movieTitle} numberOfLines={1}>
                {movie_details.title}
            </Text>
            <Text style={styles.movieYear}>{movie_details.release_date.slice(0, 4)}</Text>
            <View style={styles.genreContainer}>
                {movie_details.genres.slice(0, 2).map((genre, index) => (
                    <Text style={styles.genreText} key={genre.id}>
                        {genre.name}
                    </Text>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    movieCard: {
        width: 140,
        marginLeft: 16,
    },
    posterContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#ffffff10',
    },
    posterImage: {
        width: '100%',
        height: '100%',
    },
    posterPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#00000080',
        borderRadius: 4,
        padding: 4,
    },
    matchText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    saveButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        backgroundColor: '#00000080',
        borderRadius: 999999,
    },
    movieTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 8,
    },
    movieYear: {
        color: '#ffffff80',
        fontSize: 14,
        marginTop: 4,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
        gap: 4,
    },
    genreText: {
        color: '#ffffff80',
        fontSize: 12,
        backgroundColor: '#ffffff20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
});