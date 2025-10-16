import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext.tsx/AppContext';

const { width } = Dimensions.get('window');

// --- WelcomeMessage Component (Originally WelcomeMessage.tsx) ---
export const WelcomeMessage = () => {
  const { userData, isReturningUser } = useApp();
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current; // Start off-screen above

  useEffect(() => {
    if (userData?.username && isReturningUser) {
      setShow(true);
      
      // Animate in
      Animated.timing(slideAnim, {
        toValue: 0, // Slide into view (no offset)
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Animate out after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
            toValue: -100, // Slide back out
            duration: 400,
            delay: 3000,
            useNativeDriver: true,
        }).start(() => setShow(false));
      }, 0); // Start the animation timer immediately

      return () => clearTimeout(timer);
    }
  }, [userData, isReturningUser]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 20, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          Welcome back, {userData?.username || 'User'}!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: '#5C7AB8', // Mocking gradient with a solid color
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999, // full rounded
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 