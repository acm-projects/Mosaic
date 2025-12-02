import LoadingPopup from '@/components/loading_popup';
import MovieCard from '@/components/movie_swipe_card';
import { require_user, sign_out } from '@/lib/auth';
import { get_user_data, update_favorite_movies } from '@/lib/firestore/users';
import { fetch_movies_for_genres } from '@/lib/movies_api';
import { theme } from '@/lib/styles';
import { MovieDetails } from '@/lib/types';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FavoriteMovies() {
    const [rated_count, set_rated_count] = useState(0);
    const [movie_idx, set_movie_idx] = useState(0);
    const [movies, set_movies] = useState<MovieDetails[]>([]);
    const [favorite_movies, set_favorite_movies] = useState<number[]>([]);
    const [loading, set_loading] = useState(false);
    const { favorite_genres } = useLocalSearchParams();

    const navigation = useNavigation();

    useEffect(() => {
        async function fetch() {
            set_loading(true);
            let genres: string[] = [];

            try {
                genres = JSON.parse(favorite_genres as string);
            } catch (e) {
                const user = require_user();
                const result = await get_user_data(user.uid);

                if (!result.ok) {
                    console.log("Failed to fetch user data:", result.error);
                    set_loading(false);
                    return;
                }

                genres = result.data.favorite_genre ?? [];
            }

            const movies = await fetch_movies_for_genres(genres);

            set_movies(movies);
            set_loading(false);
        }

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK') {
                e.preventDefault();
            }
        });

        fetch();
        return unsubscribe;
    }, []);

    function handle_swipe(dir: 'left' | 'right' | 'skip') {
        switch (dir) {
            case 'right':
                set_favorite_movies([...favorite_movies, movies[movie_idx].id]);
                set_rated_count(rated_count + 1);
                set_movie_idx(movie_idx + 1);
                break;
            case 'left':
                set_rated_count(rated_count + 1);
                set_movie_idx(movie_idx + 1);
                break;
            case 'skip':
                set_movie_idx(movie_idx + 1);
                break;
        }
    }

    async function handle_finish() {
        console.log('Finished rating movies. Favorite movies: ', favorite_movies);

        const user = require_user();
        const result = await update_favorite_movies(user.uid, favorite_movies);

        if (!result.ok) {
            console.log('Failed to update favorite movies: ', result.error);
            return;
        }

        router.replace('/home/(tabs)');
    }

    function render_movie_card() {
        if (rated_count === 10) {
            handle_finish();
            return null
        }
        if (!movies[movie_idx]) return null;

        return (
            <MovieCard
                movie_data={movies[movie_idx]}
                onSwipe={handle_swipe}
                key={movies[movie_idx].id}
            />
        );
    }

    return (
        <View style={styles.container}>
            <LoadingPopup visible={loading} />

            {/* Back Button */}
            <View style={styles.back_button}>
                <LogOut
                    size={24}
                    color={"white"}
                    onPress={async () => {
                        set_loading(true);
                        await sign_out();
                        set_loading(false);
                        router.replace("/auth/login");
                    }}
                />
            </View>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
                <Text style={styles.title}>Build Your Taste</Text>
                <View style={styles.progressRow}>
                    <Text style={styles.progressText}>Rate movies you've seen</Text>
                    <Text style={styles.progressText}>{rated_count}/10 rated</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(rated_count / 10) * 100}%` }]} />
                </View>
            </View>

            <View style={styles.mainContent}>
                {/* Movie Card with Buttons */}
                {render_movie_card()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
    },
    back_button: {
        position: "absolute",
        top: theme.spacing.massive,
        right: theme.spacing.xxl,
        zIndex: 20,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.border_radius.full,
        padding: theme.spacing.md,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    progressContainer: {
        paddingTop: 80,
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    progressText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#1f2937',
        borderRadius: 8,
        width: '100%',
        overflow: 'hidden',
        marginTop: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#5C7AB8',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 24,
    },
    instructions: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    instructionsText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
    },
    skipForNow: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
    },
});