import LoadingPopup from '@/components/loading_popup';
import PageBackground from '@/components/page_background';
import { join_group } from '@/lib/firebase_firestore';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function JoinGroupScreen() {
    const [join_code, set_join_code] = useState('');
    const [loading, set_loading] = useState(false);

    const handleJoin = async () => {
        if (join_code.length !== 6) return;

        set_loading(true);
        try {
            const result = await join_group(join_code);

            if (result.success) {
                router.replace('/home');
            } else {
                Alert.alert('Error', result.error || 'Failed to join group.');
            }
        } catch (error) {
            console.error('Join group failed:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            set_loading(false);
        }
    };

    return (
        <View style={styles.container}>
            <PageBackground />
            <LoadingPopup visible={loading} />
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
                value={join_code}
                onChangeText={(text) => set_join_code(text.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                style={styles.input}
                editable={!loading}
            />

            {/* Join button */}
            <TouchableOpacity
                onPress={handleJoin}
                style={[styles.joinButton, (join_code.length !== 6 || loading) && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={join_code.length !== 6 || loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.joinButtonText}>Join Group</Text>
                )}
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
