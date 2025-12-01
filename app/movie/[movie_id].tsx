import BackButton from '@/components/back_button';
import LoadingPopup from '@/components/loading_popup';
import { get_movie_by_code } from '@/lib/movies_api';
import { MovieDetails } from '@/lib/types';
import { useGlobalSearchParams } from 'expo-router';
import { Calendar, Clock, Film, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToastManager, { Toast } from 'toastify-react-native';

const { width, height } = Dimensions.get('window');
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export default function MovieDetailsPage() {
    const { movie_id } = useGlobalSearchParams<{ movie_id: string }>();
    const [movie, set_movie] = useState<MovieDetails | null>(null);
    const [loading, set_loading] = useState(true);

    useEffect(() => {
        async function fetch_movie() {
            const result = await get_movie_by_code(parseInt(movie_id));

            if (result.ok) {
                set_movie(result.data);
            } else {
                Toast.error('Failed to load movie details', 'bottom');
            }

            set_loading(false);
        }

        if (movie_id) {
            fetch_movie();
        }
    }, [movie_id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingPopup visible={loading} />
            </SafeAreaView>
        );
    }

    if (!movie) {
        return (
            <SafeAreaView style={styles.container}>
                <BackButton />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Movie not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const backdrop_url = movie.backdrop_path ? `${TMDB_IMAGE_BASE}original${movie.backdrop_path}` : null;
    const poster_url = movie.poster_path ? `${TMDB_IMAGE_BASE}w500${movie.poster_path}` : null;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView}>
                {/* Backdrop Image */}
                {backdrop_url ? (
                    <Image
                        source={{ uri: backdrop_url }}
                        style={styles.backdrop}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.backdrop, styles.placeholderBackdrop]} />
                )}

                <BackButton />

                {/* Content */}
                <View style={styles.content}>
                    {/* Poster & Title Section */}
                    <View style={styles.headerSection}>
                        {poster_url && (
                            <Image
                                source={{ uri: poster_url }}
                                style={styles.poster}
                                resizeMode="cover"
                            />
                        )}

                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{movie.title}</Text>
                            {movie.tagline && (
                                <Text style={styles.tagline}>"{movie.tagline}"</Text>
                            )}
                        </View>
                    </View>

                    {/* Info Row */}
                    <View style={styles.infoRow}>
                        {movie.release_date && (
                            <View style={styles.infoItem}>
                                <Calendar size={16} color="#818cf8" />
                                <Text style={styles.infoText}>
                                    {new Date(movie.release_date).getFullYear()}
                                </Text>
                            </View>
                        )}

                        {movie.runtime && (
                            <View style={styles.infoItem}>
                                <Clock size={16} color="#818cf8" />
                                <Text style={styles.infoText}>{movie.runtime} min</Text>
                            </View>
                        )}

                        {movie.vote_average > 0 && (
                            <View style={styles.infoItem}>
                                <Star size={16} color="#facc15" fill="#facc15" />
                                <Text style={[styles.infoText, { color: '#facc15' }]}>
                                    {movie.vote_average.toFixed(1)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <View style={styles.genresContainer}>
                            {movie.genres.map((genre) => (
                                <View key={genre.id} style={styles.genreBadge}>
                                    <Text style={styles.genreText}>{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Overview */}
                    {movie.overview && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <Text style={styles.overview}>{movie.overview}</Text>
                        </View>
                    )}

                    {/* Additional Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Details</Text>

                        {movie.status && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Status:</Text>
                                <Text style={styles.detailValue}>{movie.status}</Text>
                            </View>
                        )}

                        {movie.original_language && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Language:</Text>
                                <Text style={styles.detailValue}>
                                    {movie.original_language.toUpperCase()}
                                </Text>
                            </View>
                        )}

                        {movie.budget > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Budget:</Text>
                                <Text style={styles.detailValue}>
                                    ${movie.budget.toLocaleString()}
                                </Text>
                            </View>
                        )}

                        {movie.revenue > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Revenue:</Text>
                                <Text style={styles.detailValue}>
                                    ${movie.revenue.toLocaleString()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Production Companies */}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Production Companies</Text>
                            <View style={styles.companiesContainer}>
                                {movie.production_companies.map((company) => (
                                    <View key={company.id} style={styles.companyBadge}>
                                        <Film size={14} color="#ffffff80" />
                                        <Text style={styles.companyText}>{company.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <ToastManager />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    backdrop: {
        width: width,
        height: height * 0.4,
    },
    placeholderBackdrop: {
        backgroundColor: '#1a1a1a',
    },
    content: {
        padding: 24,
        paddingTop: 0,
        marginTop: -40,
    },
    headerSection: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 16,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#818cf8',
    },
    titleSection: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#ffffff80',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    genreBadge: {
        backgroundColor: '#818cf8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    genreText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
    },
    overview: {
        fontSize: 16,
        color: '#ffffff',
        lineHeight: 24,
    },
    detailRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff10',
    },
    detailLabel: {
        fontSize: 14,
        color: '#ffffff80',
        width: 100,
    },
    detailValue: {
        fontSize: 14,
        color: '#ffffff',
        flex: 1,
        fontWeight: '500',
    },
    companiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    companyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#ffffff10',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffffff20',
    },
    companyText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ffffff',
        fontSize: 18,
    },
});