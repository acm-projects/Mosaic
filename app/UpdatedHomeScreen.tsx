import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { RNImage } from '../components';
import MosaicLogo from '../components/mosaic_logo';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { RNButton } from '../components/RNButton';
import { useApp } from '../context/AppContext';
import { movies as mockMovies } from '../data/movies';
import { styles } from '@/components/HomeScreen';

const groupQuizQuestions = [
  { question: "🎬 What kind of movie night do you prefer?", options: ["Chill", "Intense", "Emotional", "Funny"] },
  { question: "🍿 Pick your go-to genre:", options: ["Action", "Romance", "Comedy", "Horror"] },
  { question: "🌌 Which genre do you watch most often?", options: ["Sci-Fi", "Drama", "Thriller", "Fantasy"] },
  { question: "🕵️ Favorite movie era?", options: ["Classic", "2000s", "Modern", "Future"] },
  { question: "🎥 Best type of storyline:", options: ["Mystery", "Adventure", "Romance", "Documentary"] },
  { question: "👀 Favorite type of main character:", options: ["Underdog", "Villain", "Hero", "Antihero"] },
  { question: "🎭 How should a movie end?", options: ["Happy", "Sad", "Cliffhanger", "Twist"] },
];

export default function HomeScreen() {
  const { userData, setCurrentScreen, updateUserData } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupQuiz, setShowGroupQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  const topPicks = mockMovies.slice(0, 8);
  const watchAgain = userData?.watchedMovies?.length ? mockMovies.filter(m => userData.watchedMovies.includes(m.id)) : [];
  const surpriseMe = mockMovies.slice(14, 20);
  const trending = mockMovies.slice(0, 6);

  function calculateMatch(movie: any) {
    if (!userData) return Math.floor(Math.random() * 30) + 70;
    const genreMatches = movie.genre.filter(g => userData.genres.includes(g)).length;
    return Math.min(95, 70 + (genreMatches * 8));
  }

  function handleCreateGroup() {
    setCurrentScreen('group-setup');
  }

  function handleGroupClick(groupId: any) {
    setSelectedGroupId(groupId);
    setShowGroupQuiz(false);
  }

  function handleTakeGroupQuiz() {
    setShowGroupQuiz(true);
  }

  function handleQuizAnswer(answer: any) {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < groupQuizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      if (userData && selectedGroupId) {
        const updatedGroups = userData.groups.map(group => {
          if (group.id === selectedGroupId) {
            return {
              ...group,
              quizCompleted: [...(group.quizCompleted || []), 'You'],
              hasGroupQuiz: true,
              topPicks: [1, 2, 3, 4, 5, 6, 7, 8]
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
  }

  function handleShowTopPicks() {
    if (selectedGroupId) {
      setCurrentScreen('group-top-picks');
      setSelectedGroupId(null);
    }
  }

  function handleSaveMovie(movie: any) {
    if (!userData) return;
    const isSaved = userData.savedMovies?.includes(movie.id);
    if (isSaved) {
      const newSaved = userData.savedMovies.filter(id => id !== movie.id);
      updateUserData({ savedMovies: newSaved });
    } else {
      const newSaved = [...(userData.savedMovies || []), movie.id];
      updateUserData({ savedMovies: newSaved });
    }
  }

  const selectedGroup = userData?.groups.find(g => g.id === selectedGroupId);

  // UI SECTIONS RETURN FUNCTIONS
  function renderHeader() {
    return (
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <MosaicLogo size="md" />
      </View>
    );
  }

  function renderGroupsSection() {
    return (
      <View style={styles.groupsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.movieRowTitle}>Your Groups</Text>
          <TouchableOpacity onPress={handleCreateGroup} style={styles.createGroupButton}>
            <Feather name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
        {userData?.groups && userData.groups.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupList}>
            {userData.groups.map(group => (
              <TouchableOpacity key={group.id} onPress={() => handleGroupClick(group.id)} style={styles.groupCard}>
                <View style={styles.groupCardInner}>
                  <View style={[styles.groupAvatar, { backgroundColor: group.color }]}>
                    <Feather name="users" size={32} color="white" />
                  </View>
                  {group.pendingInvites?.length > 0 && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>{group.pendingInvites.length}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.groupCardName} numberOfLines={1}>{group.name}</Text>
                {group.pendingInvites?.length > 0 && (
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
    );
  }

  function MovieCard({ movie }) {
    const isSaved = userData?.savedMovies?.includes(movie.id);
    const matchScore = calculateMatch(movie);

    return (
      <View style={styles.movieCard}>
        <TouchableOpacity onPress={() => setSelectedMovie(movie)} style={styles.movieCardButton}>
          <View style={styles.posterContainer}>
            <Image src={movie.poster} alt={movie.title} style={styles.posterImage} />
          </View>
        </TouchableOpacity>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>{matchScore}% Match</Text>
        </View>
        <TouchableOpacity onPress={() => handleSaveMovie(movie)} style={styles.saveButton}>
          <Feather name="bookmark" size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.movieCardTitle}>{movie.title}</Text>
        <Text style={styles.movieCardYear}>{movie.year}</Text>
      </View>
    );
  }

  function MovieRow({ title, movies }) {
    return (
      <View style={styles.movieRowContainer}>
        <Text style={styles.movieRowTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.movieList}>
          {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </ScrollView>
      </View>
    );
  }

  function renderMoviesSection() {
    return (
      <>
        {userData?.groups
          ?.filter(g => g.hasGroupQuiz && g.topPicks?.length > 0)
          .map(group => (
            <MovieRow
              key={`group-picks-${group.id}`}
              title={`Top Picks for ${group.name}`}
              movies={group.topPicks.map(id => mockMovies.find(m => m.id === id)).filter(Boolean)}
            />
          ))}
        <MovieRow title="Top Picks for You" movies={topPicks} />
        {watchAgain.length > 0 && <MovieRow title="Watch Again" movies={watchAgain} />}
        <MovieRow title="Surprise Me" movies={surpriseMe} />
        <MovieRow title="Trending" movies={trending} />
      </>
    );
  }

  function renderGroupModal() {
    if (!selectedGroupId || !selectedGroup) return null;

    return (
      <Modal animationType="slide" transparent visible onRequestClose={() => setSelectedGroupId(null)}>
        <View style={styles.groupModalOverlay}>
          <View style={styles.groupModalContent}>
            <View style={styles.groupModalHeader}>
              <Text style={styles.groupModalTitle}>{selectedGroup.name}</Text>
              <TouchableOpacity onPress={() => setSelectedGroupId(null)}>
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.groupModalScrollContent}>
              {showGroupQuiz ? renderGroupQuiz() : renderGroupStatus()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderGroupQuiz() {
    return (
      <View style={styles.quizUI}>
        <Text style={styles.quizProgressText}>
          Question {currentQuizQuestion + 1}/{groupQuizQuestions.length}
        </Text>
        <Text style={styles.quizQuestion}>
          {groupQuizQuestions[currentQuizQuestion].question}
        </Text>
        {groupQuizQuestions[currentQuizQuestion].options.map((opt, i) => (
          <TouchableOpacity key={i} onPress={() => handleQuizAnswer(opt)} style={styles.quizOptionButton}>
            <Text style={styles.quizOptionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function renderGroupStatus() {
    const completed = selectedGroup.quizCompleted?.includes('You');
    return (
      <View style={styles.quizStatusUI}>
        {!completed ? (
          <RNButton title="Complete Group Quiz" onPress={handleTakeGroupQuiz} />
        ) : (
          <RNButton title="Show Top Picks" onPress={handleShowTopPicks} />
        )}
      </View>
    );
  }

  //MAIN RETURN below
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {renderHeader()}
        <View style={styles.content}>
          {renderGroupsSection()}
          {renderMoviesSection()}
        </View>
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
