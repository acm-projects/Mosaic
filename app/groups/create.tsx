import BackButton from '@/components/back_button';
import LoadingPopup from '@/components/loading_popup';
import { create_group } from '@/lib/firestore/groups';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';

const groupColors = [
    '#5C7AB8', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
];

export default function CreateGroupScreen() {
    const [group_name, set_group_name] = useState('');
    const [group_icon, set_group_icon] = useState<string>("");
    const [loading, set_loading] = useState(false);

    const random_color = groupColors[Math.floor(Math.random() * groupColors.length)];

    async function handle_create() {
        if (!group_name) return;

        set_loading(true);

        const result = await create_group(group_name, random_color);

        set_loading(false);
        
        if (!result.ok) {
            alert("Error creating group: " + result.error);
            return;
        } else {
            router.replace(`/groups/invite?code=${result.data}`);
        }
    }

    async function handle_edit_icon() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Toast.error('Permission to access photos is required!', 'bottom');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            set_group_icon(result.assets[0].uri);
            Toast.success('Icon updated!', 'bottom');
        }
    }


    return (
        <View style={styles.container}>
            <BackButton />
            <LoadingPopup visible={loading} />

            {/* Title */}
            <Text style={styles.title}>Create Your Group</Text>

            {/* Icon Circle with Edit Button */}
            <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: random_color }]}>
                    {group_icon ? (
                        <Image
                            source={{ uri: group_icon }}
                            style={styles.iconImage}
                        />
                    ) : (
                        <Users size={40} color="white" />
                    )}
                </View>
                {/* <TouchableOpacity
                    style={styles.editButton}
                    onPress={handle_edit_icon}
                    activeOpacity={0.8}
                >
                    <Pencil size={14} color="white" />
                </TouchableOpacity> */}
            </View>

            {/* Group Name Input */}
            <TextInput
                placeholder="Group name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={group_name}
                onChangeText={set_group_name}
                style={styles.input}
            />

            {/* Create Group Button */}
            <TouchableOpacity
                onPress={handle_create}
                style={[styles.createButton, !group_name && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={!group_name}
            >
                <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>

            <ToastManager />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 128,
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
        position: 'relative',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editButton: {
        position: 'absolute',
        top: 0,
        right: '50%',
        marginRight: -48, // Half of icon width (80/2) + offset (8) = -48
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
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