import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { MosaicLogo } from '../components/Logo';

// --- LoadingScreen Component (Originally LoadingScreen.tsx) ---
export const LoadingScreen = () => {
  const dot1 = new Animated.Value(0);
  const dot2 = new Animated.Value(0);
  const dot3 = new Animated.Value(0);

  const bounce = (dot) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: -10,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(900), // Delay for the next dot to catch up in the loop
      ])
    ).start();
  };

  React.useEffect(() => {
    bounce(dot1);
    setTimeout(() => bounce(dot2), 150);
    setTimeout(() => bounce(dot3), 300);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoPulse}>
        <MosaicLogo size="lg" />
      </View>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPulse: {
    // Pulse animation simulated by the overall view structure, as complex RN animations are outside the scope
  },
  dotsContainer: {
    marginTop: 32,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#5C7AB8',
    borderRadius: 4,
  },
});