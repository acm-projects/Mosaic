import BackButton from "@/components/back_button";
import LoadingPopup from "@/components/loading_popup";
import MovieRow from "@/components/movie_row";
import { get_group } from "@/lib/firestore/groups";
import { get_user_data } from "@/lib/firestore/users";
import { FirestoreGroup, FirestoreUser } from "@/lib/types";
import * as Clipboard from 'expo-clipboard';
import { useGlobalSearchParams } from "expo-router";
import { Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from "toastify-react-native";


export default function GroupScreen() {
    const { group_id } = useGlobalSearchParams<{ group_id: string }>();
    const [group_details, set_group_details] = useState<FirestoreGroup>();
    const [user_details, set_user_details] = useState<FirestoreUser[]>();
    const [loading, set_loading] = useState<boolean>(true);

    useEffect(() => {
        async function fetch_group_detail() {
            const response = await get_group(group_id);

            if (response.ok) {
                set_group_details(response.data);
            } else {
                Toast.error("Failed to fetch group details.", 'bottom');
            }

            set_loading(false);
        }

        fetch_group_detail();
    }, [group_id]);

    useEffect(() => {
        async function fetch_users() {
            group_details?.members.forEach(async (member_id) => {
                const user_data = await get_user_data(member_id);
                if (user_data.ok) {
                    set_user_details(prev => prev ? [...prev, user_data.data] : [user_data.data]);
                } else {
                    Toast.error(`Failed to fetch data for member ID: ${member_id}`, 'bottom');
                }
            });
        }

        fetch_users();
    }, [group_details?.members]);

    return (
        <SafeAreaView style={styles.container}>
            <LoadingPopup visible={loading} />

            {!loading && group_details && (
                <View>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <BackButton />

                        {/* Group Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <View style={[styles.defaultIcon, { backgroundColor: group_details.group_icon }]}>
                                    <Users size={48} color='white' />
                                </View>
                            </View>

                            <Text style={styles.groupName}>{group_details.group_name}</Text>

                            <TouchableOpacity onPress={async () => {
                                await Clipboard.setStringAsync(group_details.join_code);
                                Toast.success('Join code copied to clipboard!', 'bottom');
                            }}>
                                <View style={styles.codeContainer}>
                                    <Text style={styles.codeLabel}>Join Code</Text>
                                    <Text style={styles.code}>{group_details.join_code}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Members Section */}
                        <View style={styles.membersSection}>
                            <Text style={styles.sectionTitle}>Members</Text>
                            <View style={styles.membersList}>
                                {group_details.members.map((member_id, index) => (
                                    <View key={member_id} style={styles.memberCard}>
                                        <View style={styles.memberAvatar}>
                                            <Users size={20} color="white" />
                                        </View>
                                        <Text style={styles.memberName}>{user_details?.at(index)?.username}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>


                    </ScrollView>
                    <MovieRow movies={[]} title="What You All Might Like" />
                </View>
            )}


            <ToastManager />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        marginBottom: 16,
    },
    groupIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#818cf8',
    },
    defaultIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#5C7AB8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#818cf8',
    },
    groupName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    codeContainer: {
        backgroundColor: '#ffffff10',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff20',
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 12,
        color: '#ffffff80',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    code: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#818cf8',
        letterSpacing: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff10',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff20',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#ffffff80',
        marginTop: 4,
    },
    actionsContainer: {
        marginBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7B9ED9',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff10',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff20',
        gap: 8,
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    membersSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    membersList: {
        gap: 12,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff10',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff20',
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#818cf8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    memberInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    memberName: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
});