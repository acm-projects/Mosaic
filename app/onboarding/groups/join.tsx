// src/screens/GroupSetup/JoinGroupScreen.tsx
import PageBackground from '@/components/page_background';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function JoinGroupScreen() {
    const [joinCode, setJoinCode] = useState('');

    const handleJoin = () => {
        if (joinCode.length === 6) {
            router.navigate('/home');
        }
    };

    return (
        <View style={styles.container}>
            <PageBackground />
            {/* Back Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
            >
                <ArrowLeft size={20} color="white" />
            </TouchableOpacity>

            {/* Title and subtitle */}
            <Text style={styles.title}>Join a Group</Text>
            <Text style={styles.subtitle}>Enter the group code</Text>

            {/* Input field */}
            <TextInput
                placeholder="e.g. ABC123"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={joinCode}
                onChangeText={(text) => setJoinCode(text.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                style={styles.input}
            />

            {/* Join button */}
            <TouchableOpacity
                onPress={handleJoin}
                style={[styles.joinButton, joinCode.length !== 6 && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={joinCode.length !== 6}
            >
                <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingTop: 64,
    },
    backButton: {
        position: 'absolute',
        top: 64,
        left: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderRadius: 8,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 4,
    },
    joinButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#7B9ED9',
        borderRadius: 8,
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
