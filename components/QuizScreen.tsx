import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RNButton } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';

const genres = [
  { name: 'Action', emoji: '💥' },
  { name: 'Comedy', emoji: '😂' },
  { name: 'Drama', emoji: '🎭' },
  { name: 'Horror', emoji: '👻' },
  { name: 'Sci-Fi', emoji: '🚀' },
  { name: 'Romance', emoji: '❤️' },
  { name: 'Thriller', emoji: '😱' },
  { name: 'Animation', emoji: '🎨' },
  { name: 'Documentary', emoji: '📹' },
  { name: 'Fantasy', emoji: '🧙' },
  { name: 'Mystery', emoji: '🔍' },
  { name: 'Adventure', emoji: '🗺️' }
];

const moods = [
  { 
    id: 'intensity', 
    label: 'How intense do you like it?',
    options: [
      { text: 'Chill', emoji: '😌' },
      { text: 'Balanced', emoji: '⚖️' },
      { text: 'Intense', emoji: '🔥' }
    ]
  },
  { 
    id: 'tone', 
    label: "What's your vibe?",
    options: [
      { text: 'Light & Funny', emoji: '😂' },
      { text: 'Mixed', emoji: '🎭' },
      { text: 'Dark & Serious', emoji: '🌙' }
    ]
  },
  { 
    id: 'pace', 
    label: 'Preferred pacing?',
    options: [
      { text: 'Slow Burn', emoji: '🕯️' },
      { text: 'Moderate', emoji: '🚶' },
      { text: 'Fast-Paced', emoji: '⚡' }
    ]
  }
];

// --- QuizScreen Component (Originally QuizScreen.tsx) ---
export const QuizScreen = () => {
  const { setCurrentScreen, updateUserData, isReturningUser, previousScreen } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [step, setStep] = useState(1);
  const [moodAnswers, setMoodAnswers] = useState({});

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else if (prev.length < 3) {
        return [...prev, genre];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (step === 1 && selectedGenres.length === 3) {
      setStep(2);
    } else if (step === 2 && Object.keys(moodAnswers).length === moods.length) {
      updateUserData({ genres: selectedGenres });
      // If user is retaking quiz from profile, return to profile
      if (isReturningUser) {
        setCurrentScreen('profile');
      } else {
        setCurrentScreen('streaming-setup');
      }
    } else if (step === 1) {
        Alert.alert("Selection Required", "Please select exactly 3 genres to continue.");
    } else if (step === 2) {
        Alert.alert("Selection Required", "Please answer all mood questions.");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      // Logic for going back from Step 1
      if (isReturningUser) {
        setCurrentScreen('profile');
      } else if (previousScreen === 'google-signup') {
        setCurrentScreen('google-signup');
      } else {
        setCurrentScreen('create-account');
      }
    } else {
      setStep(1);
    }
  };

  const quizCompleted = step === 2 && Object.keys(moodAnswers).length === moods.length;
  const isContinueDisabled = (step === 1 && selectedGenres.length !== 3) || (step === 2 && !quizCompleted);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={[styles.backButton, { top: insets.top + 16 }]}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={[styles.progressItem, step === 1 ? styles.activeProgress : styles.inactiveProgress]}>
          <View style={[styles.progressDot, step === 1 ? styles.activeDot : styles.inactiveDot]} />
          <Text style={step === 1 ? styles.activeText : styles.inactiveText}>Genres</Text>
        </View>
        <View style={[styles.progressItem, step === 2 ? styles.activeProgress : styles.inactiveProgress]}>
          <View style={[styles.progressDot, step === 2 ? styles.activeDot : styles.inactiveDot]} />
          <Text style={step === 2 ? styles.activeText : styles.inactiveText}>Mood</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}>
        {step === 1 ? (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>What do you love watching?</Text>
              <Text style={styles.subtitle}>Select exactly 3 genres</Text>
            </View>

            <View style={styles.genresGrid}>
              {genres.map(genre => {
                const isSelected = selectedGenres.includes(genre.name);
                return (
                  <TouchableOpacity
                    key={genre.name}
                    onPress={() => toggleGenre(genre.name)}
                    style={[
                      styles.genreButton,
                      isSelected ? styles.selectedGenre : styles.unselectedGenre
                    ]}
                  >
                    <Text style={styles.emojiText}>{genre.emoji}</Text>
                    <Text style={styles.genreText}>{genre.name}</Text>
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <Feather name="check" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Set your preferences</Text>
              <Text style={styles.subtitle}>Help us personalize your experience</Text>
            </View>

            <View style={styles.moodsContainer}>
              {moods.map(mood => (
                <View key={mood.id} style={styles.moodQuestion}>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                  <View style={styles.moodOptions}>
                    {mood.options.map(option => {
                      const isSelected = moodAnswers[mood.id] === option.text;
                      return (
                        <TouchableOpacity
                          key={option.text}
                          onPress={() => setMoodAnswers({ ...moodAnswers, [mood.id]: option.text })}
                          style={[
                            styles.moodButton,
                            isSelected ? styles.selectedMood : styles.unselectedMood
                          ]}
                        >
                          <Text style={styles.emojiText}>{option.emoji}</Text>
                          <Text style={styles.moodOptionText}>{option.text}</Text>
                          {isSelected && (
                            <View style={styles.checkIcon}>
                              <Feather name="check" size={16} color="white" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomButtonWrapper, { paddingBottom: insets.bottom + 10 }]}>
        <RNButton
          onPress={handleContinue}
          title={step === 1 ? `Continue (${selectedGenres.length}/3)` : 'Continue'}
          disabled={isContinueDisabled}
          style={[
            styles.continueButton,
            { backgroundColor: isContinueDisabled ? '#5C7AB880' : '#7B9ED9' }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff26',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#ffffff33',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 32,
    paddingTop: 80,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  activeProgress: {
    backgroundColor: '#5C7AB8',
    borderColor: '#5C7AB8',
  },
  inactiveProgress: {
    backgroundColor: '#ffffff1a',
    borderColor: '#ffffff33',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: '#9ca3af',
  },
  activeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveText: {
    color: '#ffffffb3',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffffb3',
    textAlign: 'center',
  },
  
  // Step 1: Genres
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    paddingBottom: 20,
  },
  genreButton: {
    width: '31%', // Approx to fit 3 per row with gaps
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    position: 'relative',
    padding: 8,
  },
  emojiText: {
    fontSize: 32,
  },
  genreText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedGenre: {
    backgroundColor: '#ffffff33',
    borderColor: '#ffffff66',
  },
  unselectedGenre: {
    backgroundColor: '#ffffff1a',
    borderColor: '#ffffff33',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5C7AB8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 2: Moods
  moodsContainer: {
    width: '100%',
    gap: 32,
  },
  moodQuestion: {
    gap: 16,
  },
  moodLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  moodOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedMood: {
    backgroundColor: '#ffffff33',
    borderColor: '#ffffff66',
  },
  unselectedMood: {
    backgroundColor: '#ffffff1a',
    borderColor: '#ffffff33',
  },

  // Bottom Button
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: 'rgba(10, 10, 26, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#ffffff1a',
  },
  continueButton: {
    height: 48,
  }
});