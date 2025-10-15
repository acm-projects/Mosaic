import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Assuming your AppContext is set up to work with React Native
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Bell, Check, LogOut, RefreshCw, Tv, User } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';

// --- Constants ---
const LEVELS = [ 
  { level: 1, title: 'Movie Newbie', movies: 0 },
  { level: 2, title: 'Casual Viewer', movies: 5 }, 
  { level: 3, title: 'Film Enthusiast', movies: 15 }, 
  { level: 4, title: 'Cinema Buff', movies: 30 },
  { level: 5, title: 'Movie Master', movies: 50 },
  { level: 6, title: 'Film Critic', movies: 75 },
  { level: 7, title: 'Cinema Legend', movies: 100 },
];

const STREAMING_SERVICES = [
  { name: 'Netflix', logo: 'N', color: '#E50914' },
  { name: 'Disney+', logo: 'D+', color: '#113CCF' },
  { name: 'HBO Max', logo: 'HBO', color: '#6C5CE7' },
  { name: 'Amazon Prime', logo: 'P', color: '#00A8E1' },
  { name: 'Hulu', logo: 'H', color: '#1CE783' },
  // We add 'isApple' to handle the special SVG case
  { name: 'Apple TV+', logo: 'TV+', color: '#000000', isApple: true }, 
  { name: 'Paramount+', logo: 'P+', color: '#0064FF' },
  { name: 'Peacock', logo: 'P', color: '#6C2C91' },
  { name: 'Showtime', logo: 'SHO', color: '#FF0000' },
];

// --- Reusable custom components (replaces shadcn/ui) ---
const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressFill, { width: `${value}%` }]} />
  </View>
);

const AppleIcon = ({ color, size = 28 }: { color: string, size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </Svg>
);

// --- Main Profile Screen Component ---
export function ProfileScreen() {
  const { userData, updateUserData, setCurrentScreen } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    userData?.streamingServices || []
  );
  const [isLevelsModalVisible, setLevelsModalVisible] = useState(false);

  // All your business logic remains exactly the same
  const currentLevel = LEVELS.find(l => l.level === (userData?.level || 1)) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === (userData?.level || 1) + 1);
  const moviesWatched = userData?.watchedMovies?.length || 0;
  const progress = nextLevel
    ? ((moviesWatched - currentLevel.movies) / (nextLevel.movies - currentLevel.movies)) * 100
    : 100;

  const toggleService = (serviceName: string) => {
    const updatedServices = selectedServices.includes(serviceName)
      ? selectedServices.filter(s => s !== serviceName)
      : [...selectedServices, serviceName];
    setSelectedServices(updatedServices);
    updateUserData({ streamingServices: updatedServices });
  };

  const handleRetakeQuiz = () => setCurrentScreen('quiz');
  const handleLogout = () => setCurrentScreen('auth');

  return (
    <LinearGradient colors={['#000000', '#0a0a1a', '#000000']} style={styles.flex1}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false} // This replaces the "scrollbar-hide" class
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.content}>
          {/* User Info Card */}
          <View style={styles.card}>
            <View style={styles.userInfoHeader}>
              <View style={styles.avatar}>
                <User color="white" size={32} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.username}>{userData?.username || 'Guest'}</Text>
                <Text style={styles.email}>{userData?.email}</Text>
              </View>
            </View>

            {/* Level System */}
            <View style={styles.levelSection}>
              <View style={styles.levelHeader}>
                <View style={styles.levelTitleContainer}>
                  <Award color="#5C7AB8" size={20} />
                  <Text style={styles.levelTitle}>{currentLevel.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setLevelsModalVisible(true)}>
                  <Text style={styles.linkText}>View All Levels</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.progressInfo}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelText}>{moviesWatched} movies watched</Text>
                  {nextLevel && <Text style={styles.progressLabelText}>{nextLevel.movies} to next level</Text>}
                </View>
                <ProgressBar value={progress} />
              </View>
            </View>
          </View>

          {/* Favorite Genres Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Favorite Genres</Text>
              <TouchableOpacity onPress={handleRetakeQuiz} style={styles.retakeButton}>
                <RefreshCw color="#7B9ED9" size={16} />
                <Text style={styles.linkText}>Retake Quiz</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genresContainer}>
              {userData?.genres.map((genre) => (
                <View key={genre} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Streaming Services Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderIcon}>
               <Tv color="#5C7AB8" size={20} />
               <Text style={styles.cardTitle}>My Streaming Services</Text>
            </View>
            <View style={styles.servicesGrid}>
                {STREAMING_SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service.name);
                    return (
                        <TouchableOpacity
                            key={service.name}
                            onPress={() => toggleService(service.name)}
                            style={[styles.serviceTile, isSelected && styles.serviceTileSelected]}
                        >
                            <View>
                                {service.isApple ? (
                                    <AppleIcon color={isSelected ? '#FFFFFF' : service.color} />
                                ) : (
                                    <Text style={[styles.serviceLogo, { color: isSelected ? '#FFFFFF' : service.color }]}>
                                        {service.logo}
                                    </Text>
                                )}
                                {isSelected && (
                                    <View style={styles.checkIconContainer}>
                                        <Check color="#5C7AB8" size={10} />
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                                {service.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
          </View>

          {/* Notifications Card */}
          <View style={styles.card}>
            <View style={styles.notificationRow}>
              <View style={styles.notificationTextContainer}>
                <Bell color="#5C7AB8" size={20} />
                <View>
                    <Text style={styles.cardTitle}>Notifications</Text>
                    <Text style={styles.cardSubtitle}>Get updates about new recommendations</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: '#2a2a4a', true: '#5C7AB8' }}
                thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
                onValueChange={setNotifications}
                value={notifications}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut color="#f87171" size={16} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Levels Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLevelsModalVisible}
        onRequestClose={() => setLevelsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                 <Text style={styles.modalTitle}>All Levels</Text>
                 <Text style={styles.modalDescription}>Track your progress by watching movies</Text>
                 <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollView}>
                    {LEVELS.map((level) => {
                        const isCurrent = level.level === userData?.level;
                        const isUnlocked = level.movies <= moviesWatched;
                        return (
                           <View
                             key={level.level}
                             style={[
                                styles.levelRow,
                                isCurrent ? styles.levelRowCurrent : 
                                isUnlocked ? styles.levelRowUnlocked : styles.levelRowLocked
                             ]}
                           >
                             <View>
                               <Text style={styles.levelRowTitle}>{level.title}</Text>
                               <Text style={styles.levelRowSubtitle}>Watch {level.movies} movies</Text>
                             </View>
                             <Text style={styles.levelRowIcon}>{isUnlocked ? '✓' : '🔒'}</Text>
                           </View>
                        )
                    })}
                 </ScrollView>
                 <Pressable style={styles.closeButton} onPress={() => setLevelsModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                 </Pressable>
            </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// --- StyleSheet: The React Native way of styling ---
const styles = StyleSheet.create({
    flex1: { flex: 1 },
    container: { paddingBottom: 48 },
    header: { paddingTop: 64, paddingBottom: 24, paddingHorizontal: 24 },
    headerTitle: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    content: { paddingHorizontal: 24, gap: 24 },
    card: { backgroundColor: '#0a0a1a', borderRadius: 16, padding: 24, gap: 16 },
    userInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#5C7AB8', alignItems: 'center', justifyContent: 'center' },
    username: { fontSize: 20, color: 'white', fontWeight: '600' },
    email: { fontSize: 14, color: '#9CA3AF' },
    levelSection: { paddingTop: 16, borderTopWidth: 1, borderColor: 'rgba(92, 122, 184, 0.2)', gap: 12 },
    levelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    levelTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    levelTitle: { color: 'white', fontSize: 16 },
    linkText: { fontSize: 14, color: '#7B9ED9' },
    progressInfo: { gap: 4 },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    progressLabelText: { fontSize: 12, color: '#9CA3AF' },
    progressContainer: { height: 8, backgroundColor: '#2a2a4a', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#5C7AB8' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardHeaderIcon: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    cardTitle: { color: 'white', fontSize: 16, fontWeight: '500' },
    retakeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    genreTag: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#5C7AB8', borderRadius: 9999 },
    genreText: { color: 'white', fontSize: 14 },
    servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -4 },
    serviceTile: { width: '33.33%', aspectRatio: 1, padding: 4 },
    serviceTileSelected: { backgroundColor: '#5C7AB8', borderColor: '#5C7AB8' },
    serviceLogo: { fontSize: 24, fontWeight: 'bold' },
    checkIconContainer: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    serviceName: { fontSize: 10, lineHeight: 12, textAlign: 'center', color: '#9CA3AF' },
    serviceNameSelected: { color: 'white' },
    notificationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    notificationTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    cardSubtitle: { fontSize: 14, color: '#9CA3AF' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: 8, gap: 8 },
    logoutButtonText: { color: '#F87171', fontWeight: '500' },
    // Modal Styles
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    modalContent: { width: '90%', maxHeight: '80%', backgroundColor: '#0a0a1a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(92, 122, 184, 0.3)', padding: 24, gap: 12 },
    modalScrollView: { flexShrink: 1 },
    modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    modalDescription: { color: '#9CA3AF', fontSize: 14, marginBottom: 8 },
    levelRow: { padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    levelRowCurrent: { backgroundColor: '#5C7AB8' },
    levelRowUnlocked: { backgroundColor: '#2a2a4a' },
    levelRowLocked: { backgroundColor: '#1a1a2e', opacity: 0.6 },
    levelRowTitle: { color: 'white', fontWeight: '500' },
    levelRowSubtitle: { color: '#9CA3AF', fontSize: 12 },
    levelRowIcon: { fontSize: 24, color: '#9CA3AF' },
    closeButton: { backgroundColor: '#5C7AB8', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    closeButtonText: { color: 'white', fontWeight: 'bold' }
});  