import { MovieDetails } from "@/lib/types";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MovieCard from "./movie_card";

export default function MovieRow({ title, movies }: { title: string; movies: MovieDetails[] }) {
    return (
        <View style={styles.movieRow}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.movieList}
            >
                {movies.map(movie => (
                    <MovieCard
                        movie_details={movie}
                        key={movie.id}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    movieRow: {
        padding: 16,
    },
    movieList: {
        paddingTop: 16,
        paddingRight: 16,
    },
});