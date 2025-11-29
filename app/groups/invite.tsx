import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Copy, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

export default function InviteGroupScreen() {
    const { code } = useLocalSearchParams<{
        code: string;
    }>();

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(code || '');
            ToastAndroid.show('Code copied!', ToastAndroid.SHORT);
        } catch {
            ToastAndroid.show('Failed to copy.', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity
                onPress={() => router.navigate('/home')}
                style={styles.backButton}
                activeOpacity={0.7}
            >
                <ArrowLeft size={20} color="white" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Users size={40} color="white" />
                </View>
                <Text style={styles.title}>Group Created!</Text>
                <Text style={styles.subtitle}>Share this code with friends</Text>
            </View>

            {/* Code display box */}
            <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{code}</Text>
                <TouchableOpacity
                    onPress={handleCopy}
                    style={styles.copyButton}
                    activeOpacity={0.8}
                >
                    <Copy size={18} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.copyText}>Copy Invite Code</Text>
                </TouchableOpacity>
            </View>

            {/* Continue button */}
            <TouchableOpacity
                onPress={() => router.navigate('/home')}
                style={styles.continueButton}
                activeOpacity={0.8}
            >
                <Text style={styles.continueText}>Continue to Home</Text>
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
        justifyContent: 'center',
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#5C7AB8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 4,
        fontWeight: '600',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
    },
    codeContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 24,
        marginBottom: 24,
    },
    codeText: {
        fontSize: 32,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 6,
        fontFamily: 'monospace',
        marginBottom: 16,
    },
    copyButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    copyText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    continueButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#7B9ED9',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});
