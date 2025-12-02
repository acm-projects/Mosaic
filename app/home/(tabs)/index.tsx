import MoodSelector from '@/components/mood_selector';
import MosaicLogo from '@/components/mosaic_logo';
import MovieRow from '@/components/movie_row';
import { Toast, useToast } from '@/components/toast';
import { require_user } from '@/lib/auth';
import { get_group } from '@/lib/firestore/groups';
import { get_user_data } from '@/lib/firestore/users';
import { get_movie_by_code } from '@/lib/movies_api';
import { FirestoreGroup, MovieDetails } from '@/lib/types';
import { router } from 'expo-router';
import { Plus, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const codes_to_fetch = [27205, 27206, 27207, 27208, 27209, 27210]

function Header({ insets }: { insets: ReturnType<typeof useSafeAreaInsets> }) {
    return (
        <View style={[styles.header, { paddingTop: insets.top + 32 }]}>
            <MosaicLogo size="lg" show_subtitle={false} />
        </View>
    );
}

function GroupSection({ groups }: { groups: FirestoreGroup[] }) {
    return (
        <View style={styles.groupsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Groups</Text>
                <TouchableOpacity style={styles.createGroupButton} onPress={() => {
                    router.navigate('/groups');
                }}>
                    <Plus size={16} color="white" />
                </TouchableOpacity>
            </View>
            {groups.length > 0 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.groupList}
                >
                    {groups.map((group: FirestoreGroup) => (
                        <TouchableOpacity
                            key={group.join_code}
                            onPress={() => router.navigate(`/groups/${group.uid}`)}
                            style={styles.groupCard}
                        >
                            <View style={[styles.groupAvatar, { backgroundColor: group.group_icon }]}>
                                <Users size={32} color='white' />
                            </View>
                            <Text style={styles.groupName} numberOfLines={1}>
                                {group.group_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noGroups}>
                    <View style={styles.noGroupsIcon}>
                        <Users size={32} color="#ffffff80" />
                    </View>
                    <Text style={styles.noGroupsText}>
                        Create or join your first group
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function Home() {
    const insets = useSafeAreaInsets();

    const [movies, set_movies] = useState<MovieDetails[]>([]);
    const [groups, set_groups] = useState<FirestoreGroup[]>([]);
    const [show_mood_modal, set_show_mood_modal] = useState(false);
    const [mood_answers, set_mood_answers] = useState<{ [key: string]: string }>({});

    const { toastConfig, showSuccess, showError, hideToast } = useToast();

    useEffect(() => {
        async function fetch_movies() {
            const movies_list: MovieDetails[] = [];
            for (let code of codes_to_fetch) {
                const movie = await get_movie_by_code(code)
                if (movie.ok) {
                    movies_list.push(movie.data);
                } else {
                    showError(`Failed to fetch movie ${code}: ${movie.error}`);
                }
            }
            set_movies(movies_list);
        }

        fetch_movies();
    }, []);

    useEffect(() => {
        async function fetch_groups() {
            const user = require_user();
            const user_data = await get_user_data(user.uid);

            if (user_data.ok) {
                const group_promises = user_data.data.groups.map(async group => {
                    const group_data = await get_group(group);
                    if (group_data.ok) {
                        return group_data.data;
                    }
                    return null;
                });

                const fetched_groups = await Promise.all(group_promises);
                const valid_groups = fetched_groups.filter(g => g !== null) as FirestoreGroup[];
                set_groups(valid_groups);
            } else {
                showError(`Failed to fetch user data: ${user_data.error}`);
            }
        }

        fetch_groups();
    }, []);

    function handle_save_mood() {
        console.log('Mood answers:', mood_answers);
        showSuccess('Mood preferences saved!');
        set_show_mood_modal(false);
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Header insets={insets} />
                <GroupSection groups={groups} />
                <MovieRow title="You Might Like" movies={movies} />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 24 }]}
                onPress={() => set_show_mood_modal(true)}
                activeOpacity={0.9}
            >
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.fabIcon}
                />
            </TouchableOpacity>

            {/* Mood Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={show_mood_modal}
                onRequestClose={() => set_show_mood_modal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Set Your Mood</Text>
                            <TouchableOpacity
                                onPress={() => set_show_mood_modal(false)}
                                style={styles.closeButton}
                            >
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <MoodSelector
                                answers={mood_answers}
                                set_answers={set_mood_answers}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handle_save_mood}
                            >
                                <Text style={styles.saveButtonText}>Save Preferences</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast
                visible={toastConfig.visible}
                message={toastConfig.message}
                type={toastConfig.type}
                onHide={hideToast}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    signOutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    groupsSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    createGroupButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    groupList: {
        paddingRight: 16,
    },
    groupCard: {
        marginLeft: 16,
        alignItems: 'center',
    },
    groupAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    groupName: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 80,
    },
    noGroups: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffffff10',
        borderRadius: 12,
    },
    noGroupsIcon: {
        marginBottom: 16,
    },
    noGroupsText: {
        color: '#ffffff80',
        fontSize: 16,
    },
    movieCard: {
        width: 140,
        marginLeft: 16,
    },
    fab: {
        position: 'absolute',
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#818cf8',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#000',
    },
    fabIcon: {
        width: 36,
        height: 36,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#0a0a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff20',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
    },
    modalFooter: {
        padding: 20,
        paddingTop: 12,
    },
    saveButton: {
        backgroundColor: '#818cf8',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});