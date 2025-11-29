import PageBackground from '@/components/page_background';
import { router } from 'expo-router';
import { Plus, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChooseGroupAction() {
    return (
        <View style={styles.container}>
            <PageBackground />
            
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Users size={48} color="white" />
                </View>
            </View>

            <Text style={styles.title}>Watch Together</Text>
            <Text style={styles.subtitle}>
                Create or join a group to get recommendations based on everyone's taste
            </Text>

            <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={() => router.navigate('/onboarding/groups/create')}
                activeOpacity={0.8}
            >
                <Plus size={20} color="white" style={styles.iconSpacing} />
                <Text style={styles.buttonText}>Create a Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.joinButton]}
                onPress={() => router.navigate('/onboarding/groups/join')}
                activeOpacity={0.8}
            >
                <Text style={styles.joinButtonText}>Join Existing Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.navigate('/home')}
                style={styles.skipContainer}
            >
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#5C7AB8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 15,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButton: {
        backgroundColor: '#7B9ED9',
    },
    iconSpacing: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    joinButton: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    skipContainer: {
        width: '100%',
        paddingVertical: 12,
        marginTop: 24,
    },
    skipText: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
