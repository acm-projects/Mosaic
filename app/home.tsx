import MosaicLogo from '@/components/mosaic_logo';
import MovieCard from '@/components/movie_card_tinder';
import { get_movie_by_code, MovieDetails } from '@/lib/movies_api';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const group_quiz_questions = [
    { question: "🎬 What kind of movie night do you prefer?", options: ["Chill", "Intense", "Emotional", "Funny"] },
    { question: "🍿 Pick your go-to genre:", options: ["Action", "Romance", "Comedy", "Horror"] },
    { question: "🌌 Which genre do you watch most often?", options: ["Sci-Fi", "Drama", "Thriller", "Fantasy"] },
    { question: "🕵️ Favorite movie era?", options: ["Classic", "2000s", "Modern", "Future"] },
    { question: "🎥 Best type of storyline:", options: ["Mystery", "Adventure", "Romance", "Documentary"] },
    { question: "👀 Favorite type of main character:", options: ["Underdog", "Villain", "Hero", "Antihero"] },
    { question: "🎭 How should a movie end?", options: ["Happy", "Sad", "Cliffhanger", "Twist"] },
];

const codes_to_fetch = [27205, 27206, 27207, 27208, 27209, 27210]

interface MovieRowProps {
    title: string;
    movies: MovieDetails[];
}

function Header({ insets }: { insets: ReturnType<typeof useSafeAreaInsets> }) {
    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <MosaicLogo size="md" />
        </View>
    );
}

function GroupSection() {
    return (
        <View style={styles.groupsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Groups</Text>
                <TouchableOpacity style={styles.createGroupButton}>
                    <Feather name="plus" size={16} color="white" />
                </TouchableOpacity>
            </View>
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupList}
            >
                {userData.groups.map((group: Group) => (
                    <TouchableOpacity
                        key={group.id}
                        onPress={() => handleGroupClick(group.id)}
                        style={styles.groupCard}
                    >
                        <View style={[styles.groupAvatar, { backgroundColor: group.color }]}>
                            <Feather name="users" size={32} color="white" />
                        </View>
                        <Text style={styles.groupName} numberOfLines={1}>
                            {group.name}
                        </Text>
                        {group.pendingInvites && group.pendingInvites.length > 0 && (
                            <View style={styles.pendingBadge}>
                                <Text style={styles.pendingText}>
                                    {group.pendingInvites.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView> */}
            <View style={styles.noGroups}>
                <View style={styles.noGroupsIcon}>
                    <Feather name="users" size={32} color="#ffffff80" />
                </View>
                <Text style={styles.noGroupsText}>
                    Create or join your first group
                </Text>
            </View>
        </View>
    );
}

const MovieRow = ({ title, movies }: MovieRowProps) => (
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
                />
            ))}
        </ScrollView>
    </View>
)

export default function Home() {
    const insets = useSafeAreaInsets();

    const [selected_movie, set_selected_movie] = useState<MovieDetails | null>(null);
    const [selected_group_id, set_selected_group_id] = useState<string | null>(null);
    const [show_group_quiz, set_show_group_quiz] = useState(false);
    const [current_quiz_question, set_current_quiz_question] = useState(0);
    const [quiz_answers, set_quiz_answers] = useState<string[]>([]);
    const [movies, set_movies] = useState<MovieDetails[]>([]);

    // efficient
    useEffect(() => {
        async function fetchMovies() {
            const movies_list: MovieDetails[] = [];
            for (let code of codes_to_fetch) {
                const movie = await get_movie_by_code(code)
                if (movie != null) {
                    movies_list.push(movie);
                }
            }
            set_movies(movies_list);
        }
        fetchMovies();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Header insets={insets} />
                <GroupSection />
                <MovieRow title="Recommended for You" movies={movies} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    signOutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    groupsSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    createGroupButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    groupList: {
        paddingRight: 16,
    },
    groupCard: {
        marginLeft: 16,
        alignItems: 'center',
    },
    groupAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    groupName: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 80,
    },
    noGroups: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffffff10',
        borderRadius: 12,
    },
    noGroupsIcon: {
        marginBottom: 16,
    },
    noGroupsText: {
        color: '#ffffff80',
        fontSize: 16,
    },
    movieRow: {
        padding: 16,
    },
    movieList: {
        paddingTop: 16,
        paddingRight: 16,
    },
    movieCard: {
        width: 140,
        marginLeft: 16,
    },
});