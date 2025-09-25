import { MosaicLogo } from '@/components/mosaic_logo'; // ✅ import your logo
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginScreenProps {
  onLogin: (isNewUser?: boolean) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const stars = useMemo(
    () =>
      [...Array(50)].map((_, i) => ({
        key: i,
        left: Math.random() * Dimensions.get('window').width,
        top: Math.random() * Dimensions.get('window').height,
      })),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Stars background */}
      {stars.map((star) => (
        <View
          key={star.key}
          style={[styles.star, { left: star.left, top: star.top }]}
        />
      ))}

      {/* Welcome overlay */}
      {showWelcome && username && (
        <View style={styles.overlay}>
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>{username}!</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ✅ Logo and tagline */}
        <View style={styles.logoContainer}>
          <MosaicLogo size="lg" animated />
          <Text style={styles.tagline}>Discover what to watch together</Text>
        </View>

        {/* Login form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>
            {isSignup ? 'Email' : 'Username or Email'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              isSignup
                ? 'Enter your email'
                : 'Enter your username or email'
            }
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (isSignup) {
                onLogin(true);
              } else {
                if (username) {
                  setShowWelcome(true);
                  setTimeout(() => onLogin(false), 1500);
                } else {
                  onLogin(false);
                }
              }
            }}
          >
            <Text style={styles.buttonText}>
              {isSignup ? 'Continue' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or continue with</Text>

          {/* ...social login buttons... */}

          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleText}>
              {!isSignup
                ? "Don't have an account?"
                : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
              <Text style={styles.toggleButtonText}>
                {!isSignup ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBox: { alignItems: 'center' },
  welcomeText: { color: '#fff', fontSize: 32, marginBottom: 4 },
  usernameText: { color: '#6366F1', fontSize: 28, fontWeight: '500' },

  logoContainer: { alignItems: 'center', marginBottom: 40 },
  tagline: { color: '#ccc', fontSize: 18, marginTop: 8 },

  formContainer: { width: '100%', maxWidth: 400 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(100,100,120,0.5)',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366F1',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  orText: { color: '#888', textAlign: 'center', marginVertical: 10 },
  toggleTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  toggleText: { color: '#888' },
  toggleButtonText: { color: '#6366F1', marginLeft: 4 },
});
