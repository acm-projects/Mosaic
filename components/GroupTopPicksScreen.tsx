import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { RNImage } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { initialGroup, mockMovies } from '../data/Mocks';
import { showToast } from '../utils/Utils';

const { width } = Dimensions.get('window');

// --- GroupTopPicksScreen Component (Originally GroupTopPicksScreen.tsx) ---
export const GroupTopPicksScreen = ({ groupId }) => {
  const { setCurrentScreen, userData, updateUserData } = useApp();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  
  // Mock group data retrieval
  const group = userData?.groups.find(g => g.id === groupId) || initialGroup;
  const topPickMovies = group?.topPicks?.map(id => mockMovies.find(m => m.id === id)).filter(m => m !== undefined) || [];
  
  const handleSaveMovie = (movieId) => {
    if (!userData) return;
    
    const isSaved = userData.savedMovies.includes(movieId);
    const newSaved = isSaved
      ? userData.savedMovies.filter(id => id !== movieId)
      : [...userData.savedMovies, movieId];
    
    updateUserData({ savedMovies: newSaved });
    showToast(isSaved ? 'Movie removed from saved' : 'Movie saved');
  };

  const calculateMatch = (movie) => {
    if (!userData) return Math.floor(Math.random() * 30) + 70;
    const genreMatches = movie.genre.filter(g => userData.genres.includes(g)).length;
    return Math.min(95, 70 + (genreMatches * 8));
  };
  
  const viewabilityConfigCallback = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const itemWidth = width * 0.85; 
  const itemMargin = 24;

  const renderTopPickItem = ({ item: movie, index }) => {
    const isSaved = userData?.savedMovies?.includes(movie.id);
    const matchScore = calculateMatch(movie);

    return (
      <View style={[styles.topPickItemContainer, { width: itemWidth }]}>
        <TouchableOpacity 
          onPress={() => setSelectedMovie(movie)}
          style={styles.topPickItemButton}
        >
          <View style={styles.topPickPosterContainer}>
            <RNImage src={movie.poster} alt={movie.title} style={styles.topPickPoster} />
            <View style={styles.topPickOverlay} />
            
            {/* Movie info overlay */}
            <View style={styles.topPickInfoOverlay}>
              <View style={styles.topPickBadges}>
                <View style={styles.topPickBadge}>
                  <Text style={styles.topPickBadgeText}>{matchScore}% Match</Text>
                </View>
                <View style={styles.topPickBadge}>
                  <Text style={styles.topPickBadgeText}>{movie.year}</Text>
                </View>
              </View>
              <Text style={styles.topPickTitle}>{movie.title}</Text>
              <Text style={styles.topPickGenres}>{movie.genre.slice(0, 3).join(' • ')}</Text>
            </View>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            onPress={() => handleSaveMovie(movie.id)}
            style={styles.topPickSaveButton}
          >
            <Feather 
              name="bookmark" 
              size={20} 
              color="#fff" 
              style={{ fill: isSaved ? '#fff' : 'none' }}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Additional info below card */}
        <View style={styles.topPickAdditionalInfo}>
          <View style={styles.topPickMetaRow}>
            <Text style={styles.topPickMetaText}>{movie.rating}/10</Text>
            <Text style={styles.topPickMetaText}>{movie.duration}</Text>
          </View>
          <Text style={styles.topPickDescription} numberOfLines={3}>{movie.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('home')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Top Picks</Text>
          <Text style={styles.subtitle}>{group.name}</Text>
        </View>
      </View>

      {/* Horizontal Scrolling Movies (Using FlatList for paging/viewability) */}
      <FlatList
        data={topPickMovies}
        renderItem={renderTopPickItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + itemMargin}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onViewableItemsChanged={viewabilityConfigCallback}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        getItemLayout={(data, index) => ({
            length: itemWidth + itemMargin,
            offset: (itemWidth + itemMargin) * index,
            index,
        })}
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationDots}>
        {topPickMovies.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { width: index === currentIndex ? 32 : 8, backgroundColor: index === currentIndex ? '#5C7AB8' : '#ffffff4d' }
            ]}
          />
        ))}
      </View>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          matchScore={calculateMatch(selectedMovie)}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
        paddingBottom: 24,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff26',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#ffffffb3',
        fontSize: 14,
    },

    // Carousel Styles
    carouselContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    topPickItemWrapper: {
        marginRight: 24,
    },
    topPickItemContainer: {
        marginRight: 24,
    },
    topPickItemButton: {
        width: '100%',
    },
    topPickPosterContainer: {
        aspectRatio: 2 / 3,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    topPickPoster: {
        width: '100%',
        height: '100%',
    },
    topPickOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        // Simple dark gradient simulation
    },
    topPickInfoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        gap: 8,
    },
    topPickBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    topPickBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    topPickBadgeText: {
        color: '#fff',
        fontSize: 12,
    },
    topPickTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    topPickGenres: {
        color: '#ffffffcc',
        fontSize: 14,
    },
    topPickSaveButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Additional Info
    topPickAdditionalInfo: {
        marginTop: 16,
        gap: 8,
    },
    topPickMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    topPickMetaText: {
        color: '#ffffffb3',
        fontSize: 14,
    },
    topPickDescription: {
        color: '#ffffff99',
        fontSize: 14,
        lineHeight: 20,
    },

    // Pagination Dots
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        transitionDuration: '300ms',
    },
});