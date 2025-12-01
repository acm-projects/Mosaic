import { sign_out } from '@/lib/auth';
import { router } from 'expo-router';
import {
    Award,
    Bell,
    Check,
    LogOut,
    RefreshCw,
    Tv,
    User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const STREAMING_SERVICES = [
    { name: 'Netflix', logo: 'N', color: '#E50914' },
    { name: 'Disney+', logo: 'D+', color: '#113CCF' },
    { name: 'HBO Max', logo: 'HBO', color: '#6C5CE7' },
    { name: 'Amazon Prime', logo: 'P', color: '#00A8E1' },
    { name: 'Hulu', logo: 'H', color: '#1CE783' },
    { name: 'Apple TV+', logo: 'TV+', color: '#000000' },
    { name: 'Paramount+', logo: 'P+', color: '#0064FF' },
    { name: 'Peacock', logo: 'P', color: '#6C2C91' },
    { name: 'Showtime', logo: 'SHO', color: '#FF0000' },
];

export default function ProfileScreen({ userData, updateUserData, setCurrentScreen }: any) {
    const [notifications, setNotifications] = useState(true);
    const [selectedServices, setSelectedServices] = useState<string[]>(
        userData?.streamingServices || []
    );
    const [showLevelsModal, setShowLevelsModal] = useState(false);

    const moviesWatched = userData?.watchedMovies?.length || 0;

    const toggleService = (serviceName: string) => {
        const updated = selectedServices.includes(serviceName)
            ? selectedServices.filter((s) => s !== serviceName)
            : [...selectedServices, serviceName];
        setSelectedServices(updated);
        updateUserData?.({ streamingServices: updated });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Info */}
                <View style={styles.card}>
                    <View style={styles.userRow}>
                        <View style={styles.avatar}>
                            <User size={32} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.username}>
                                {userData?.username || 'Guest'}
                            </Text>
                            <Text style={styles.email}>{userData?.email}</Text>
                        </View>
                    </View>

                    {/* Level System */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <View style={styles.rowCenter}>
                                <Award size={18} color="#5C7AB8" />
                            </View>

                            <TouchableOpacity onPress={() => setShowLevelsModal(true)}>
                                <Text style={styles.linkText}>View All Levels</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.metaText}>
                                    {moviesWatched} movies watched
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Favorite Genres */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Favorite Genres</Text>
                        <TouchableOpacity
                            style={styles.rowCenter}
                        >
                            <RefreshCw size={16} color="#7B9ED9" />
                            <Text style={styles.linkText}> Retake Quiz</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.genreWrap}>
                        {userData?.genres?.map((genre: string) => (
                            <View key={genre} style={styles.genreTag}>
                                <Text style={styles.genreText}>{genre}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Streaming Services */}
                <View style={styles.card}>
                    <View style={[styles.rowCenter, { marginBottom: 10 }]}>
                        <Tv size={18} color="#5C7AB8" />
                        <Text style={styles.cardTitle}> My Streaming Services</Text>
                    </View>

                    <View style={styles.serviceGrid}>
                        {STREAMING_SERVICES.map((service) => {
                            const selected = selectedServices.includes(service.name);
                            return (
                                <TouchableOpacity
                                    key={service.name}
                                    onPress={() => toggleService(service.name)}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.serviceButton,
                                        selected ? styles.serviceSelected : styles.serviceDefault,
                                    ]}
                                >
                                    <View style={styles.serviceLogo}>
                                        <Text
                                            style={[
                                                styles.serviceLogoText,
                                                { color: selected ? '#fff' : service.color },
                                            ]}
                                        >
                                            {service.logo}
                                        </Text>
                                        {selected && (
                                            <View style={styles.checkBadge}>
                                                <Check size={12} color="#5C7AB8" />
                                            </View>
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            styles.serviceName,
                                            { color: selected ? '#fff' : '#bbb' },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {service.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View style={styles.rowCenter}>
                            <Bell size={18} color="#5C7AB8" />
                            <View style={{ marginLeft: 8 }}>
                                <Text style={styles.cardTitle}>Notifications</Text>
                                <Text style={styles.metaText}>
                                    Get updates about new recommendations
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            thumbColor={notifications ? '#5C7AB8' : '#444'}
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={async () => {
                        await sign_out();
                        router.replace('/auth/login');
                    }}
                    style={styles.logoutButton}
                    activeOpacity={0.8}
                >
                    <LogOut size={16} color="#ff6666" />
                    <Text style={styles.logoutText}> Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#0a0a1a',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#5C7AB8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    username: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    email: {
        color: '#aaa',
        fontSize: 13,
    },
    section: {
        borderTopWidth: 1,
        borderTopColor: '#5C7AB8AA',
        marginTop: 12,
        paddingTop: 12,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelTitle: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 6,
    },
    linkText: {
        color: '#7B9ED9',
        fontSize: 13,
    },
    progressContainer: {
        marginTop: 10,
    },
    metaText: {
        color: '#aaa',
        fontSize: 12,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    genreWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    genreTag: {
        backgroundColor: '#5C7AB8',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    genreText: {
        color: '#fff',
        fontSize: 12,
    },
    serviceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceButton: {
        width: (width - 80) / 3,
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
    },
    serviceDefault: {
        backgroundColor: '#1a1a2e',
        borderColor: '#2a2a4a',
    },
    serviceSelected: {
        backgroundColor: '#5C7AB8',
        borderColor: '#5C7AB8',
    },
    serviceLogo: {
        position: 'relative',
        alignItems: 'center',
    },
    serviceLogoText: {
        fontSize: 20,
        fontWeight: '700',
    },
    checkBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#fff',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceName: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    logoutButton: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff666655',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    logoutText: {
        color: '#ff6666',
        fontSize: 14,
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#0a0a1a',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalDescription: {
        color: '#aaa',
        fontSize: 13,
    },
    levelItem: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelActive: {
        backgroundColor: '#5C7AB8',
    },
    levelUnlocked: {
        backgroundColor: '#2a2a4a',
    },
    levelLocked: {
        backgroundColor: '#1a1a2e',
        opacity: 0.6,
    },
    levelName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    levelInfo: {
        color: '#ccc',
        fontSize: 12,
    },
    closeButton: {
        alignSelf: 'center',
        marginTop: 12,
    },
    closeText: {
        color: '#7B9ED9',
        fontSize: 14,
    },
});
