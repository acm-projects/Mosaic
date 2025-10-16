import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RNButton } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { STREAMING_SERVICES_LIST } from '../data/Mocks';

// --- StreamingSetupScreen Component (Originally StreamingSetupScreen.tsx) ---
export const StreamingSetupScreen = () => {
  const { setCurrentScreen, updateUserData } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (serviceName) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceName)) {
        return prev.filter(s => s !== serviceName);
      }
      return [...prev, serviceName];
    });
  };

  const handleContinue = () => {
    updateUserData({ streamingServices: selectedServices });
    setCurrentScreen('swipe');
  };

  const handleSkip = () => {
    updateUserData({ streamingServices: [] });
    setCurrentScreen('swipe');
  };

  const handleBack = () => {
    setCurrentScreen('quiz');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={[styles.backButton, { top: insets.top + 16 }]}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your platforms</Text>
          <Text style={styles.subtitle}>Select all streaming services you have access to</Text>
        </View>

        {/* Streaming Services Grid */}
        <View style={styles.gridContainer}>
          {STREAMING_SERVICES_LIST.map(service => {
            const isSelected = selectedServices.includes(service.name);
            const logoColor = isSelected ? '#FFFFFF' : service.color;
            const backgroundColor = isSelected ? '#5C7AB8' : '#ffffff0d';
            const borderColor = isSelected ? '#5C7AB8' : '#ffffff1a';

            return (
              <TouchableOpacity
                key={service.name}
                onPress={() => toggleService(service.name)}
                style={[styles.serviceCard, { backgroundColor, borderColor }]}
              >
                {/* Logo */}
                <View style={styles.logoContainer}>
                  {service.isApple ? (
                    // Using an icon equivalent for Apple TV+
                    <Ionicons name="logo-apple" size={40} color={logoColor} />
                  ) : (
                    <Text style={[styles.logoText, { color: logoColor }]}>
                      {service.letter}
                    </Text>
                  )}
                </View>
                
                {/* Service Name */}
                <Text style={styles.serviceName}>{service.name}</Text>
                
                {/* Checkmark */}
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Feather name="check" size={14} color="#5C7AB8" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={[styles.bottomButtonWrapper, { paddingBottom: insets.bottom + 10 }]}>
        <RNButton
          onPress={handleContinue}
          title={`Continue ${selectedServices.length > 0 ? `(${selectedServices.length})` : ''}`}
          disabled={selectedServices.length === 0}
          style={[
            styles.continueButton,
            { backgroundColor: selectedServices.length > 0 ? '#7B9ED9' : '#7B9ED999' }
          ]}
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // For spacing between rows/columns
  },
  serviceCard: {
    width: '31%', // Allows 3 cards per row with padding
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    position: 'relative',
  },
  logoContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 12,
    color: '#ffffffcc',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Buttons
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
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipText: {
    color: '#ffffffb3',
    textAlign: 'center',
    fontSize: 14,
  }
});