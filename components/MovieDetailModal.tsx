import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RNImage } from './UI';

const { height } = Dimensions.get('window');

// --- Movie Detail Modal ---
export const MovieDetailModal = ({ movie, matchScore, onClose }) => {
  if (!movie) return null;
    
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!movie}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.movieDetailContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView>
            <RNImage src={movie.backdrop} style={styles.detailBackdrop} alt={movie.title} />
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{movie.title}</Text>
              <View style={styles.detailInfoRow}>
                <Text style={styles.detailInfoText}>{movie.year}</Text>
                <Text style={styles.detailInfoText}>•</Text>
                <Text style={styles.detailInfoText}>{movie.runtime} min</Text>
                <Text style={styles.detailInfoText}>•</Text>
                <Text style={[styles.detailInfoText, { color: '#facc15' }]}>★ {movie.rating}</Text>
              </View>
              <Text style={styles.detailDescription}>{movie.description}</Text>
              <View style={styles.detailMatchBadge}>
                <Text style={styles.detailMatchText}>{matchScore}% Match</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    movieDetailContainer: {
        backgroundColor: '#0a0a1a',
        borderRadius: 16,
        width: '100%',
        height: '90%',
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    detailBackdrop: {
        width: '100%',
        height: height * 0.35,
    },
    detailContent: {
        padding: 20,
        paddingTop: 10,
    },
    detailTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    detailInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    detailInfoText: {
        color: '#ccc',
        fontSize: 14,
    },
    detailDescription: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    detailMatchBadge: {
        backgroundColor: '#5C7AB8',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-start',
    },
    detailMatchText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
