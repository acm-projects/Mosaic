import LoadingPopup from '@/components/loading_popup';
import MovieCard from '@/components/movie_swipe_card';
import PageBackground from '@/components/page_background';
import { require_user, sign_out } from '@/lib/auth';
import { get_user_data, update_favorite_movies } from '@/lib/firestore/users';
import { fetch_movies_for_genres } from '@/lib/movies_api';
import { theme } from '@/lib/styles';
import { MovieDetails } from '@/lib/types';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Heart, LogOut, RotateCcw, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

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
                on_swipe={handle_swipe}
            />
        );
    }


    return (
        <View style={styles.container}>
            <PageBackground />
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
                {/* Movie Card */}
                {render_movie_card()}

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]}>
                        <X size={32} color="#ef4444" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.skipButton]}>
                        <RotateCcw size={24} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
                        <Heart size={40} color="#22c55e" />
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionsText}>✕ Not for me • ↻ Haven't watched • ❤️ Love it</Text>
                    <TouchableOpacity>
                        <Text style={styles.skipForNow}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    card: {
        width: width * 0.75,
        aspectRatio: 2 / 3,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 10,
        position: 'relative',
    },
    cardRight: { transform: [{ translateX: 200 }, { rotate: '12deg' }] },
    cardLeft: { transform: [{ translateX: -200 }, { rotate: '-12deg' }] },
    cardSkip: { transform: [{ translateY: 200 }] },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cardInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    movieTitle: { color: '#fff', fontSize: 22, fontWeight: '600' },
    movieMeta: { color: '#d1d5db', fontSize: 14, marginTop: 4 },
    movieDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    rating: { color: '#facc15', fontSize: 14 },
    dot: { color: '#9ca3af', marginHorizontal: 6 },
    runtime: { color: '#9ca3af', fontSize: 14 },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorLeft: { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.2)' },
    indicatorRight: { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' },
    indicatorSkip: { borderColor: '#9ca3af', backgroundColor: 'rgba(107,114,128,0.2)' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginVertical: 24,
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    dislikeButton: {
        width: 64,
        height: 64,
        backgroundColor: '#374151',
        borderWidth: 2,
        borderColor: 'rgba(239,68,68,0.5)',
    },
    skipButton: {
        width: 56,
        height: 56,
        backgroundColor: '#374151',
        borderWidth: 2,
        borderColor: 'rgba(156,163,175,0.5)',
    },
    likeButton: {
        width: 80,
        height: 80,
        backgroundColor: '#374151',
        borderWidth: 2,
        borderColor: 'rgba(34,197,94,0.5)',
        shadowColor: '#22c55e',
        shadowOpacity: 0.2,
        shadowRadius: 12,
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