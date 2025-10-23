import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { MosaicLogo } from '../components/Logo';

const { width } = Dimensions.get('window');

// --- SplashScreen Component (Originally SplashScreen.tsx) ---
export const SplashScreen = ({ onComplete }) => {
  const [fadeOut] = useState(new Animated.Value(1));
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in and scale up animation for content
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onComplete());
    }, 2000); // 2000ms duration + 500ms fadeOut

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Gradient Orbs - Simplified for RN */}
      <View style={styles.gradientOrb1} />
      <View style={styles.gradientOrb2} />

      <Animated.View style={[styles.content, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <MosaicLogo size="lg" />
        <Text style={styles.subtitle}>
          Discover what to watch together
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  gradientOrb1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#5C7AB8',
    borderRadius: (width * 0.9) / 2,
    opacity: 0.1,
    // pulse animation is simulated by the overall transition
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: '20%',
    right: '10%',
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#7B9ED9',
    borderRadius: (width * 0.9) / 2,
    opacity: 0.1,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});  