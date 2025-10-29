import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MosaicLogo } from '../components/Logo';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { RNButton, RNImage } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { mockMovies } from '../data/Mocks';
import { showToast } from '../utils/Utils';

// Group quiz questions moved here for simplicity
const groupQuizQuestions = [
    { question: "🎬 What kind of movie night do you prefer?", options: ["Chill", "Intense", "Emotional", "Funny"] },
    { question: "🍿 Pick your go-to genre:", options: ["Action", "Romance", "Comedy", "Horror"] },
    { question: "🌌 Which genre do you watch most often?", options: ["Sci-Fi", "Drama", "Thriller", "Fantasy"] },
    { question: "🕵️ Favorite movie era?", options: ["Classic", "2000s", "Modern", "Future"] },
    { question: "🎥 Best type of storyline:", options: ["Mystery", "Adventure", "Romance", "Documentary"] },
    { question: "👀 Favorite type of main character:", options: ["Underdog", "Villain", "Hero", "Antihero"] },
    { question: "🎭 How should a movie end?", options: ["Happy", "Sad", "Cliffhanger", "Twist"] }
];

// --- HomeScreen Component (Originally HomeScreen.tsx) ---
export const HomeScreen = () => {
  const { userData, setCurrentScreen, updateUserData } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupQuiz, setShowGroupQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  
  // Mock data slices
  const topPicks = mockMovies.slice(0, 8);
  const watchAgain = userData?.watchedMovies?.length ? mockMovies.filter(m => userData.watchedMovies.includes(m.id)) : [];
  const surpriseMe = mockMovies.slice(14, 20);
  const trending = mockMovies.slice(0, 6);

  const calculateMatch = (movie) => {
    if (!userData) return Math.floor(Math.random() * 30) + 70;
    const genreMatches = movie.genre.filter(g => userData.genres.includes(g)).length;
    return Math.min(95, 70 + (genreMatches * 8));
  };

  const handleCreateGroup = () => {
    setCurrentScreen('group-setup');
  };

  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowGroupQuiz(false); // Reset quiz state when opening modal
  };

  const handleTakeGroupQuiz = () => {
    setShowGroupQuiz(true);
  };

  const handleQuizAnswer = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < groupQuizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz completed
      if (userData && selectedGroupId) {
        const updatedGroups = userData.groups.map(group => {
          if (group.id === selectedGroupId) {
            return {
              ...group,
              quizCompleted: [...(group.quizCompleted || []), 'You'],
              hasGroupQuiz: true,
              topPicks: [1, 2, 3, 4, 5, 6, 7, 8] // Mock generated picks
            };
          }
          return group;
        });
        updateUserData({ groups: updatedGroups });
        Alert.alert("Quiz Complete", "Your group matches have been updated!");
      }
      setShowGroupQuiz(false);
      setCurrentQuizQuestion(0);
      setQuizAnswers([]);
    }
  };

  const handleShowTopPicks = () => {
    if (selectedGroupId) {
      // In a real app, you'd pass selectedGroupId via navigation state
      setCurrentScreen('group-top-picks');
      setSelectedGroupId(null); // Close the modal
    }
  };

  const selectedGroup = userData?.groups.find(g => g.id === selectedGroupId);

  const handleSaveMovie = (movie) => {
    if (!userData) return;
    const isSaved = userData.savedMovies?.includes(movie.id);
    if (isSaved) {
      const newSaved = userData.savedMovies.filter(id => id !== movie.id);
      updateUserData({ savedMovies: newSaved });
      showToast('Movie removed from saved');
    } else {
      const newSaved = [...(userData.savedMovies || []), movie.id];
      updateUserData({ savedMovies: newSaved });
      showToast('Movie saved');
    }
  };

  const MovieCard = ({ movie }) => {
    const isSaved = userData?.savedMovies?.includes(movie.id);
    const matchScore = calculateMatch(movie);

    return (
      <View style={styles.movieCard}>
        <View style={styles.movieCardInner}>
          <TouchableOpacity 
            onPress={() => setSelectedMovie(movie)}
            style={styles.movieCardButton}
          >
            <View style={styles.posterContainer}>
              <RNImage
                src={movie.poster}
                alt={movie.title}
                style={styles.posterImage}
              />
            </View>
          </TouchableOpacity>
          
          {/* Match Badge */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{matchScore}% Match</Text>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            onPress={() => handleSaveMovie(movie)}
            style={styles.saveButton}
          >
            <Feather name="bookmark" size={16} color="white" style={{ fill: isSaved ? 'white' : 'none' }} />
          </TouchableOpacity>
        </View>
        <View style={styles.movieCardInfo}>
          <Text style={styles.movieCardTitle} numberOfLines={1}>{movie.title}</Text>
          <Text style={styles.movieCardYear}>{movie.year}</Text>
        </View>
      </View>
    );
  };

  const MovieRow = ({ title, movies }) => (
    <View style={styles.movieRowContainer}>
        <Text style={styles.movieRowTitle}>{title}</Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
            snapToInterval={144 + 12} // width (144) + gap (12)
            decelerationRate="fast"
        >
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <MosaicLogo size="md" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          
          {/* Groups Section */}
          <View style={styles.groupsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.movieRowTitle}>Your Groups</Text>
              <TouchableOpacity
                onPress={handleCreateGroup}
                style={styles.createGroupButton}
              >
                <Feather name="plus" size={16} color="white" />
              </TouchableOpacity>
            </View>
            {userData?.groups && userData.groups.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupList}
                decelerationRate="fast"
              >
                {userData.groups.map(group => (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => handleGroupClick(group.id)}
                    style={styles.groupCard}
                  >
                    <View style={styles.groupCardInner}>
                      <View 
                        style={[styles.groupAvatar, { backgroundColor: group.color }]}
                      >
                        <Feather name="users" size={32} color="white" />
                      </View>
                      {group.pendingInvites && group.pendingInvites.length > 0 && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingText}>{group.pendingInvites.length}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.groupCardName} numberOfLines={1}>{group.name}</Text>
                    {group.pendingInvites && group.pendingInvites.length > 0 && (
                      <Text style={styles.groupPendingText}>{group.pendingInvites.length} pending</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noGroups}>
                <View style={styles.noGroupsIcon}>
                  <Feather name="users" size={32} color="#ffffffb3" />
                </View>
                <Text style={styles.noGroupsText}>Create or join your first group</Text>
              </View>
            )}
          </View>

          {/* Group Top Picks - Show for groups with completed quiz */}
          {userData?.groups && userData.groups.filter(g => g.hasGroupQuiz && g.topPicks && g.topPicks.length > 0).map(group => (
            <MovieRow 
                key={`group-picks-${group.id}`} 
                title={`Top Picks for ${group.name}`} 
                movies={group.topPicks.map(id => mockMovies.find(m => m.id === id)).filter(m => m)}
            />
          ))}

          {/* Individual Movie Rows */}
          <MovieRow title="Top Picks for You" movies={topPicks} />
          {watchAgain.length > 0 && <MovieRow title="Watch Again" movies={watchAgain} />}
          <MovieRow title="Surprise Me" movies={surpriseMe} />
          <MovieRow title="Trending" movies={trending} />
        </View>
      </ScrollView>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          matchScore={calculateMatch(selectedMovie)}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Group Modal (Simulating web's fixed modal with RN Modal) */}
      {selectedGroupId && selectedGroup && (
        <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedGroupId}
            onRequestClose={() => setSelectedGroupId(null)}
        >
            <View style={styles.groupModalOverlay}>
                <View style={styles.groupModalContent}>
                    {/* Header */}
                    <View style={styles.groupModalHeader}>
                        <View style={styles.groupModalHeaderContent}>
                            <View 
                                style={[styles.groupAvatar, { backgroundColor: selectedGroup.color, width: 48, height: 48, borderRadius: 24 }]}
                            >
                                <Feather name="users" size={24} color="white" />
                            </View>
                            <Text style={styles.groupModalTitle}>{selectedGroup.name}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setSelectedGroupId(null)}
                            style={styles.groupModalCloseButton}
                        >
                            <Feather name="x" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView contentContainerStyle={styles.groupModalScrollContent}>
                        {showGroupQuiz ? (
                            /* Quiz UI */
                            <View style={styles.quizUI}>
                                <View style={styles.quizProgress}>
                                    <Text style={styles.quizProgressText}>Question {currentQuizQuestion + 1}/{groupQuizQuestions.length}</Text>
                                    <View style={styles.progressDots}>
                                        {groupQuizQuestions.map((_, idx) => (
                                            <View 
                                                key={idx}
                                                style={[styles.progressDot, idx <= currentQuizQuestion ? styles.activeDot : styles.inactiveDot]}
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.quizQuestion}>{groupQuizQuestions[currentQuizQuestion].question}</Text>

                                <View style={styles.quizOptions}>
                                    {groupQuizQuestions[currentQuizQuestion].options.map((option, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={() => handleQuizAnswer(option)}
                                            style={styles.quizOptionButton}
                                        >
                                            <Text style={styles.quizOptionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            /* Quiz Status UI */
                            <View style={styles.quizStatusUI}>
                                {!(selectedGroup.quizCompleted?.includes('You')) ? (
                                    <Text style={styles.quizStatusMessage}>Take a group quiz to find your best match.</Text>
                                ) : (
                                    <Text style={styles.quizCompletedMessage}>✓ You've completed the quiz!</Text>
                                )}
                                
                                <View style={styles.quizStatusBox}>
                                    <Text style={styles.quizStatusBoxTitle}>Quiz Status</Text>
                                    <View style={styles.memberStatusList}>
                                    {selectedGroup.members.map((member, idx) => (
                                        <View key={idx} style={styles.memberStatusItem}>
                                            <Text style={styles.memberStatusName}>{member}</Text>
                                            {selectedGroup.quizCompleted?.includes(member) ? (
                                                <Text style={styles.memberStatusCompleted}>✓ Completed</Text>
                                            ) : (
                                                <Text style={styles.memberStatusPending}>Pending</Text>
                                            )}
                                        </View>
                                    ))}
                                    </View>
                                </View>

                                {!(selectedGroup.quizCompleted?.includes('You')) ? (
                                    <RNButton
                                        onPress={handleTakeGroupQuiz}
                                        title="Complete Group Quiz"
                                        style={styles.statusButton}
                                    />
                                ) : (
                                    <RNButton
                                        onPress={handleShowTopPicks}
                                        title="Show Top Picks"
                                        style={styles.statusButton}
                                    />
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  content: {
    gap: 32,
  },
  
  // Movie Row/Section Headers
  movieRowContainer: {
    gap: 16,
  },
  movieRowTitle: {
    paddingHorizontal: 24,
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  movieList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  
  // Movie Card
  movieCard: {
    width: 144, // w-36
    // flex-shrink-0 handled by style in MovieRow
  },
  movieCardInner: {
    position: 'relative',
  },
  movieCardButton: {
    width: '100%',
  },
  posterContainer: {
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  matchBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieCardInfo: {
    marginTop: 8,
    gap: 2,
  },
  movieCardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  movieCardYear: {
    color: '#9ca3af',
    fontSize: 12,
  },

  // Groups Section
  groupsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  createGroupButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5C7AB8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  groupCard: {
    width: 128, // w-32
    alignItems: 'center',
  },
  groupCardInner: {
    position: 'relative',
  },
  groupAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5C7AB8',
  },
  pendingBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f97316', // orange-500
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  groupCardName: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  groupPendingText: {
    color: '#fbbf24', // orange-400
    fontSize: 12,
    textAlign: 'center',
  },
  noGroups: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noGroupsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noGroupsText: {
    color: '#ffffffb3',
    fontSize: 14,
  },

  // Group Modal Styles
  groupModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  groupModalContent: {
    backgroundColor: '#0a0a1a',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  groupModalHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Mocking sticky/blur effect by having solid background
    backgroundColor: '#1a1a2e', 
  },
  groupModalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupModalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  groupModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupModalScrollContent: {
    padding: 24,
    gap: 24,
  },

  // Quiz UI
  quizUI: {
    gap: 24,
  },
  quizProgress: {
    gap: 12,
  },
  quizProgressText: {
    color: '#ffffffb3',
    fontSize: 14,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    height: 4,
    width: 24,
    borderRadius: 2,
  },
  activeDot: {
    backgroundColor: '#5C7AB8',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quizQuestion: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  quizOptions: {
    gap: 12,
  },
  quizOptionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quizOptionText: {
    color: 'white',
    fontSize: 16,
  },

  // Quiz Status UI
  quizStatusUI: {
    gap: 24,
    alignItems: 'center',
  },
  quizStatusMessage: {
    color: 'white',
    textAlign: 'center',
  },
  quizCompletedMessage: {
    color: '#4ade80', // green-400
    textAlign: 'center',
  },
  quizStatusBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  quizStatusBoxTitle: {
    color: '#ffffffb3',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  memberStatusList: {
    gap: 8,
  },
  memberStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStatusName: {
    color: 'white',
  },
  memberStatusCompleted: {
    color: '#4ade80', // green-400
    fontSize: 14,
  },
  memberStatusPending: {
    color: '#9ca3af', // gray-400
    fontSize: 14,
  },
  statusButton: {
    width: '100%',
    height: 48,
  }
});