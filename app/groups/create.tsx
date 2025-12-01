// src/screens/GroupSetup/CreateGroupScreen.tsx
import BackButton from '@/components/back_button';
import { create_group } from '@/lib/firestore/groups';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const groupColors = [
    '#5C7AB8', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
];

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState('');
    const [selectedColor, setSelectedColor] = useState(groupColors[0]);

    async function handleCreate() {
        if (!groupName) return;

        const result = await create_group(groupName, selectedColor);
        if (!result.ok) {
            alert("Error creating group: " + result.error);
            return;
        } else {
            router.replace(`/groups/invite?code=${result.data}`);
        }
    }
      

    return (
        <View style={styles.container}>
            <BackButton />

            {/* Title */}
            <Text style={styles.title}>Create Your Group</Text>

            {/* Icon Circle */}
            <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: selectedColor }]}>
                    <Users size={40} color="white" />
                </View>
            </View>

            {/* Color Picker */}
            <Text style={styles.subtitle}>Choose a color</Text>
            <View style={styles.colorGrid}>
                {groupColors.map(color => (
                    <TouchableOpacity
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={[
                            styles.colorCircle,
                            { backgroundColor: color, borderColor: selectedColor === color ? 'white' : '#4B5563' },
                        ]}
                        activeOpacity={0.8}
                    />
                ))}
            </View>

            {/* Group Name Input */}
            <TextInput
                placeholder="Group name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
            />

            {/* Create Group Button */}
            <TouchableOpacity
                onPress={handleCreate}
                style={[styles.createButton, !groupName && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={!groupName}
            >
                <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: 32,
        fontWeight: '600',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 16,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 24,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 8,
        marginVertical: 8,
        borderWidth: 2,
    },
    input: {
        width: '100%',
        height: 48,
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: '#fff',
        fontSize: 16,
    },
    createButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#7B9ED9',
        borderRadius: 8,
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});
