import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { mockMovies, mockClips } from '../data/Mocks';
import { RNInput, RNImage } from '../components/UI';
import { MovieDetailModal } from '../components/MovieDetailModal';

// --- SavedScreen Component (Originally SavedScreen.tsx) ---
export const SavedScreen = () => {
  const { userData } = useApp();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Mock data for saved items from different sections
  const savedFromHome = mockMovies.filter(m => userData?.savedMovies?.includes(m.id)) || [];
  const savedFromClips = mockClips.slice(0, 4) || []; 
  const savedFromDiscover = mockMovies.slice(5, 9) || [];

  const filteredItems = (list, type) => {
    return list.filter(item => {
      const title = type === 'movie' ? item.title : item.movieTitle;
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };