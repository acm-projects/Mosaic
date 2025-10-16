import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RNImage } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { mockMovies } from '../data/Mocks';

const { width } = Dimensions.get('window');

// --- SwipeScreen Component (Originally SwipeScreen.tsx) ---
export const SwipeScreen = () => {
  const { setCurrentScreen, updateUserData } = useApp();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [notWatched, setNotWatched] = useState([]);
  const [availableMovies, setAvailableMovies] = useState(mockMovies.slice(0, 20)); // Mock initial slice
  
  const pan = useRef(new Animated.ValueXY()).current;

  const currentMovie = availableMovies[currentIndex];
  const totalRated = liked.length + disliked.length;
  const cardRotation = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const dislikeOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  // No full pan responder logic here due to complexity, using simple button handlers with visual animation.
  // The 'Animated.timing' below replaces the manual pan logic for simplicity on button press.

  const triggerAnimation = (direction) => {
    return new Promise((resolve) => {
      Animated.timing(pan, {
        toValue: { 
            x: direction === 'right' ? width : (direction === 'left' ? -width : 0), 
            y: direction === 'skip' ? height : 0 // Animate down for skip
        },
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 }); // Reset position immediately after animation ends
        resolve();
      });
    });
  };

  const handleSwipe = async (direction) => {
    if (!currentMovie) return;
    
    await triggerAnimation(direction);

    if (direction === 'right') {
      setLiked(prev => [...prev, currentMovie.id]);
    } else if (direction === 'left') {
      setDisliked(prev => [...prev, currentMovie.id]);
    } else {
      setNotWatched(prev => [...prev, currentMovie.id]);
    }

    const newTotalRated = direction === 'skip' ? totalRated : totalRated + 1;
    
    if (newTotalRated >= 3) { // Reduced to 3 for quick demo flow
      updateUserData({ 
        likedMovies: direction === 'right' ? [...liked, currentMovie.id] : liked,
        dislikedMovies: direction === 'left' ? [...disliked, currentMovie.id] : disliked
      });
      setCurrentScreen('group-setup');
      return;
    }

    // Move to next movie
    if (currentIndex < availableMovies.length - 1) {
        setCurrentIndex(currentIndex + 1);
    } else {
        // Load more mock movies (in a real app, this would fetch from API)
        const nextSliceStart = availableMovies.length;
        const moreMovies = mockMovies.slice(nextSliceStart, nextSliceStart + 5);
        if (moreMovies.length > 0) {
            setAvailableMovies(prev => [...prev, ...moreMovies]);
            setCurrentIndex(currentIndex + 1);
        } else {
            // End of mock movies list, go to next screen
            handleSkip();
        }
    }
  };

  const handleSkip = () => {
    updateUserData({ 
      likedMovies: liked,
      dislikedMovies: disliked
    });
    setCurrentScreen('group-setup');
  };

  const handleBack = () => {
    setCurrentScreen('streaming-setup');
  };

  if (!currentMovie) return <View style={styles.loadingContainer}><Text style={styles.loadingText}>No more movies! Finished rating.</Text><RNButton title="Continue" onPress={handleSkip} style={{ marginTop: 20 }} /></View>;

  const MovieCard = ({ movie }) => (
    <Animated.View
      style={[
        styles.movieCard,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: cardRotation }] }
      ]}
    >
      <RNImage
        src={movie.poster}
        alt={movie.title}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay} />
      
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{movie.title}</Text>
        <Text style={styles.cardSubtitle}>{movie.year} • {movie.genre.join(', ')}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.ratingText}>★ {movie.rating}</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText}>{movie.runtime} min</Text>
        </View>
      </View>

      {/* Swipe indicators - static for button use */}
      <View style={styles.indicatorContainer}>
        <Animated.View style={[styles.indicator, styles.likeIndicator, { opacity: likeOpacity }]}>
            <Feather name="heart" size={60} color="green" style={styles.likeIcon} />
        </Animated.View>
        <Animated.View style={[styles.indicator, styles.dislikeIndicator, { opacity: dislikeOpacity }]}>
            <Feather name="x" size={60} color="red" />
        </Animated.View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={[styles.backButton, { top: insets.top + 16 }]}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.progressSection, { paddingTop: insets.top + 70 }]}>
        <Text style={styles.progressTitle}>Build Your Taste</Text>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressText}>Rate movies you've seen</Text>
          <Text style={styles.progressText}>{totalRated}/3 rated</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(totalRated / 3) * 100}%` }]}
          />
        </View>
      </View>

      {/* Movie Card Area */}
      <View style={styles.cardArea}>
        <MovieCard movie={currentMovie} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          onPress={() => handleSwipe('left')}
          style={[styles.actionButton, styles.dislikeButton]}
        >
          <Feather name="x" size={32} color="#ef4444" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleSwipe('skip')}
          style={[styles.actionButton, styles.skipButton]}
        >
          <Feather name="rotate-ccw" size={24} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleSwipe('right')}
          style={[styles.actionButton, styles.likeButton]}
        >
          <Feather name="heart" size={40} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={styles.instructionsText}>
          <Text style={{ color: '#ef4444' }}>✕ Not for me</Text> • <Text style={{ color: '#9ca3af' }}>↻ Haven't watched</Text> • <Text style={{ color: '#10b981' }}>❤️ Love it</Text>
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipLink}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
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
  
  // Progress
  progressSection: {
    paddingBottom: 24,
  },
  progressTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffffb3',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151', // gray-800
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5C7AB8',
    // Using simple color fill instead of gradient for RN simplicity
  },

  // Card Area
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  movieCard: {
    position: 'absolute',
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'gray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    gap: 8,
  },
  cardTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: '#facc15', // yellow-400
    fontWeight: 'bold',
  },
  metaText: {
    color: '#9ca3af',
  },
  metaDivider: {
    color: '#9ca3af',
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    opacity: 0,
    transform: [{ rotate: '12deg' }],
  },
  likeIndicator: {
    borderColor: '#10b981', // green-500
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  dislikeIndicator: {
    borderColor: '#ef4444', // red-500
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ rotate: '-12deg' }],
  },
  likeIcon: {
    fill: '#10b981',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingVertical: 16,
  },
  actionButton: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#374151', // gray-700
  },
  dislikeButton: {
    width: 64,
    height: 64,
    borderColor: '#ef444480',
  },
  skipButton: {
    width: 56,
    height: 56,
    borderColor: '#9ca3af80',
  },
  likeButton: {
    width: 80,
    height: 80,
    borderColor: '#10b98180',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },

  // Instructions
  instructions: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  instructionsText: {
    color: '#ffffffb3',
    fontSize: 14,
  },
  skipLink: {
    color: '#ffffffb3',
    fontSize: 14,
    paddingVertical: 4,
  }
});  