import { auth } from "@/lib/firebase_config";
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MosaicLogo from '../components/mosaic_logo';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { useApp } from '../context/AppContext';
import { mockMovies } from '../data/movies';
import { Group, Movie } from '../types/types';

const groupQuizQuestions = [
    { question: "🎬 What kind of movie night do you prefer?", options: ["Chill", "Intense", "Emotional", "Funny"] },
    { question: "🍿 Pick your go-to genre:", options: ["Action", "Romance", "Comedy", "Horror"] },
    { question: "🌌 Which genre do you watch most often?", options: ["Sci-Fi", "Drama", "Thriller", "Fantasy"] },
    { question: "🕵️ Favorite movie era?", options: ["Classic", "2000s", "Modern", "Future"] },
    { question: "🎥 Best type of storyline:", options: ["Mystery", "Adventure", "Romance", "Documentary"] },
    { question: "👀 Favorite type of main character:", options: ["Underdog", "Villain", "Hero", "Antihero"] },
    { question: "🎭 How should a movie end?", options: ["Happy", "Sad", "Cliffhanger", "Twist"] },
]; 

const MovieCard = React.memo(({ movie, onPress, onSave, isSaved, matchScore }: { 
    movie: Movie; 
    onPress: () => void; 
    onSave: () => void; 
    isSaved?: boolean;
    matchScore: number;
}) => (
    <TouchableOpacity style={styles.movieCard} onPress={onPress}>
        <View style={styles.posterContainer}>
            {movie.poster ? (
                <Image 
                    source={{ uri: movie.poster }} 
                    style={styles.posterImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.posterPlaceholder}>
                    <Feather name="film" size={32} color="#ffffff80" />
                </View>
            )}
            <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{matchScore}% Match</Text>
            </View>
            <TouchableOpacity 
                style={styles.saveButton}
                onPress={onSave}
            >
                <Feather 
                    name="bookmark" 
                    size={24} 
                    color={isSaved ? "#FFD700" : "white"} 
                />
            </TouchableOpacity>
        </View>
        <Text style={styles.movieTitle} numberOfLines={1}>
            {movie.title}
        </Text>
        <Text style={styles.movieYear}>{movie.year}</Text>
        <View style={styles.genreContainer}>
            {movie.genre.slice(0, 2).map((genre, index) => (
                <Text key={index} style={styles.genreText}>
                    {genre}
                </Text>
            ))}
        </View>
    </TouchableOpacity>
));


export default function HomePage() {
    const insets = useSafeAreaInsets();
    const { userData, updateUserData } = useApp();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [showGroupQuiz, setShowGroupQuiz] = useState(false);
    const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

    const calculateMatch = useCallback((movie: Movie): number => {
        if (!userData?.genres) return Math.floor(Math.random() * 30) + 70;
        const genreMatches = movie.genre.filter((g: string) => userData.genres.includes(g)).length;
        return Math.min(95, 70 + (genreMatches * 8));
    }, [userData]);

    const handleCreateGroup = () => {
        // mark that navigation originated from Home so back-button can return here
        router.push({ pathname: '/onboarding/groups/create', params: { fromHome: '1' } });
    };

    const handleGroupClick = (groupId: string) => {
        setSelectedGroupId(groupId);
        setShowGroupQuiz(false);
    };

    const handleTakeGroupQuiz = () => {
        setShowGroupQuiz(true);
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.push('/auth/login');
        }).catch((error) => {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        });
    };

    const handleQuizAnswer = (answer: string) => {
        const newAnswers = [...quizAnswers, answer];
        setQuizAnswers(newAnswers);

        if (currentQuizQuestion < groupQuizQuestions.length - 1) {
            setCurrentQuizQuestion(currentQuizQuestion + 1);
        } else {
            if (userData && selectedGroupId) {
                const updatedGroups = userData.groups?.map((group: Group) => {
                    if (group.id === selectedGroupId) {
                        return {
                            ...group,
                            quizCompleted: [...(group.quizCompleted || []), 'You'],
                            hasGroupQuiz: true,
                            topPicks: mockMovies.slice(0, 8).map(m => m.id)
                        };
                    }
                    return group;
                });

                if (updatedGroups) {
                    updateUserData({ ...userData, groups: updatedGroups });
                }
                Alert.alert("Quiz Complete", "Your group matches have been updated!");
            }
            setShowGroupQuiz(false);
            setCurrentQuizQuestion(0);
            setQuizAnswers([]);
        }
    };

    const handleShowTopPicks = () => {
        if (selectedGroupId) {
            router.push("/onboarding/groups");
            setSelectedGroupId(null);
        }
    };

    const handleSaveMovie = (movie: Movie) => {
        if (!userData) return;
        const isSaved = userData.savedMovies?.includes(movie.id);
        if (isSaved) {
            const newSaved = userData.savedMovies?.filter(id => id !== movie.id) || [];
            updateUserData({ ...userData, savedMovies: newSaved });
            Alert.alert('Success', 'Movie removed from saved');
        } else {
            const newSaved = [...(userData.savedMovies || []), movie.id];
            updateUserData({ ...userData, savedMovies: newSaved });
            Alert.alert('Success', 'Movie saved');
        }
    };

    const selectedGroup = userData?.groups?.find(g => g.id === selectedGroupId);

    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <MosaicLogo size="md" />
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Feather name="log-out" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    const renderGroupsSection = () => (
        <View style={styles.groupsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Groups</Text>
                <TouchableOpacity onPress={handleCreateGroup} style={styles.createGroupButton}>
                    <Feather name="plus" size={16} color="white" />
                </TouchableOpacity>
            </View>
            {userData?.groups && userData.groups.length > 0 ? (
                <ScrollView 
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
                </ScrollView>
            ) : (
                <View style={styles.noGroups}>
                    <View style={styles.noGroupsIcon}>
                        <Feather name="users" size={32} color="#ffffff80" />
                    </View>
                    <Text style={styles.noGroupsText}>
                        Create or join your first group
                    </Text>
                </View>
            )}
        </View>
    );

    const renderMovieRow = React.useCallback(({ title, movies }: { title: string, movies: Movie[] }) => (
        <View style={styles.movieRow}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.movieList}
            >
                {movies.map(movie => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie}
                        onPress={() => setSelectedMovie(movie)}
                        onSave={() => handleSaveMovie(movie)}
                        isSaved={userData?.savedMovies?.includes(movie.id)}
                        matchScore={calculateMatch(movie)}
                    />
                ))}
            </ScrollView>
        </View>
    ), [userData?.savedMovies, calculateMatch, handleSaveMovie]);    const renderGroupQuiz = () => (
        <View style={styles.quizContainer}>
            <Text style={styles.quizProgress}>
                Question {currentQuizQuestion + 1}/{groupQuizQuestions.length}
            </Text>
            <Text style={styles.quizQuestion}>
                {groupQuizQuestions[currentQuizQuestion].question}
            </Text>
            {groupQuizQuestions[currentQuizQuestion].options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.quizOption}
                    onPress={() => handleQuizAnswer(option)}
                >
                    <Text style={styles.quizOptionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderGroupModal = () => {
        if (!selectedGroupId || !selectedGroup) return null;

        return (
            <Modal
                animationType="slide"
                transparent
                visible
                onRequestClose={() => setSelectedGroupId(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedGroupId(null)}>
                                <Feather name="x" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalScroll}>
                            {showGroupQuiz ? (
                                renderGroupQuiz()
                            ) : (
                                <View style={styles.modalActions}>
                                    {!selectedGroup.quizCompleted?.includes('You') ? (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={handleTakeGroupQuiz}
                                        >
                                            <Text style={styles.actionButtonText}>
                                                Complete Group Quiz
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={handleShowTopPicks}
                                        >
                                            <Text style={styles.actionButtonText}>
                                                Show Top Picks
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    const { loading } = useApp();

    if (loading || !userData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderHeader()}
                {renderGroupsSection()}
                {renderMovieRow({ 
                    title: "Recently Added", 
                    movies: mockMovies.slice(0, 10)
                })}
                {renderMovieRow({
                    title: "Trending Now",
                    movies: mockMovies.slice(10, 20)
                })}
                {userData.groups?.map((group: Group) => {
                    const topPicks = group.topPicks || [];
                    if (group.hasGroupQuiz && topPicks.length > 0) {
                        const groupMovies = topPicks
                            .map(id => mockMovies.find(m => m.id === id))
                            .filter((m): m is Movie => m !== undefined);
                            
                        return renderMovieRow({
                            title: `Top Picks for ${group.name}`,
                            movies: groupMovies
                        });
                    }
                    return null;
                })}
            </ScrollView>
            {selectedMovie && (
                <MovieDetailModal
                    movie={selectedMovie}
                    matchScore={calculateMatch(selectedMovie)}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
            {renderGroupModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    loadingText: {
        color: 'white',
        marginTop: 12,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    pendingBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pendingText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff20',
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalScroll: {
        padding: 16,
    },
    modalActions: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    actionButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizContainer: {
        padding: 16,
    },
    quizProgress: {
        color: '#ffffff80',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    quizQuestion: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    quizOption: {
        backgroundColor: '#ffffff10',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    quizOptionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

