import SearchMovieCard from '@/components/search_movie_card';
import { get_movie_by_code } from '@/lib/movies_api';
import { MovieDetails } from '@/lib/types';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Toast } from 'toastify-react-native';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [movie, setMovie] = useState<MovieDetails | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const movies = await get_movie_by_code(27205);

            if (movies.ok) {
                setMovie(movies.data);
            } else {
                Toast.error(`Failed to fetch movie: ${movies.error}`);
            }
        };

        fetchMovie();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) return;

        const delayDebounce = setTimeout(async () => {
            // setLoading(true);
            try {
                // const results = await search_movies(searchQuery.trim());
                // setMovie(results);
                console.log('Searching for:', searchQuery.trim());
            } catch (err) {
                console.error(err);
            } finally {
                // setLoading(false);
            }
        }, 600);

        // Cleanup: cancel the timeout if user types again before delay expires
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    const genres = [
        'All',
        'Action',
        'Comedy',
        'Drama',
        'Horror',
        'Sci-Fi',
        'Romance',
        'Thriller',
        'Animation',
        'Documentary',
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Discover</Text>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <Search color="#aaa" size={18} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search movies..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                {/* Genre Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.genreContainer}
                >
                    {genres.map((genre) => {
                        const isSelected =
                            selectedGenre === genre ||
                            (selectedGenre === '' && genre === 'All');
                        return (
                            <TouchableOpacity
                                key={genre}
                                onPress={() => setSelectedGenre(genre === 'All' ? '' : genre)}
                                style={[
                                    styles.genreButton,
                                    isSelected && styles.genreButtonActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.genreText,
                                        isSelected && styles.genreTextActive,
                                    ]}
                                >
                                    {genre}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Movies */}
            <ScrollView contentContainerStyle={styles.movieList}>
                {movie && (
                    <SearchMovieCard movie={movie} />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 24,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a35',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    genreContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    genreButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#2a2a4a',
        marginRight: 8,
    },
    genreButtonActive: {
        backgroundColor: '#5C7AB8',
    },
    genreText: {
        color: '#ccc',
        fontSize: 13,
    },
    genreTextActive: {
        color: '#fff',
    },
    movieList: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    noResultsTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 4,
    },
    noResultsSubtitle: {
        color: '#888',
    },
});

