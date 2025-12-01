import MosaicLogo from '@/components/mosaic_logo';
import MovieRow from '@/components/movie_row';
import { require_user } from '@/lib/auth';
import { get_group } from '@/lib/firestore/groups';
import { get_user_data } from '@/lib/firestore/users';
import { get_movie_by_code } from '@/lib/movies_api';
import { FirestoreGroup, MovieDetails } from '@/lib/types';
import { router } from 'expo-router';
import { Plus, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

const codes_to_fetch = [27205, 27206, 27207, 27208, 27209, 27210]

interface MovieRowProps {
    title: string;
    movies: MovieDetails[];
}

function Header({ insets }: { insets: ReturnType<typeof useSafeAreaInsets> }) {
    return (
        <View style={[styles.header, { paddingTop: insets.top + 32 }]}>
            <MosaicLogo size="lg" />
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

    useEffect(() => {
        async function fetch_movies() {
            const movies_list: MovieDetails[] = [];
            for (let code of codes_to_fetch) {
                const movie = await get_movie_by_code(code)
                if (movie.ok) {
                    movies_list.push(movie.data);
                } else {
                    Toast.error(`Failed to fetch movie ${code}: ${movie.error}`);
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
                user_data.data.groups.forEach(async group => {
                    const group_data = await get_group(group);
                    if (group_data.ok) {
                        set_groups(prev_groups => [...prev_groups, group_data.data]);
                    } else {
                        Toast.error(`Failed to fetch group data: ${group_data.error}`);
                    }
                })
            } else {
                Toast.error(`Failed to fetch user data: ${user_data.error}`);
            }
        }

        fetch_groups();
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Header insets={insets} />
                <GroupSection groups={groups} />
                <MovieRow title="You Might Like" movies={movies} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
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
});