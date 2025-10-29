import { LinearGradient } from "expo-linear-gradient";
import { Award, Bell, Tv, User } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useApp } from "../context/AppContext.tsx/AppContext";

// constants below
const LEVELS = [
  { level: 1, title: "Movie Newbie", movies: 0 },
  { level: 2, title: "Casual Viewer", movies: 5 },
  { level: 3, title: "Film Enthusiast", movies: 15 },
  { level: 4, title: "Cinema Buff", movies: 30 },
  { level: 5, title: "Movie Master", movies: 50 },
  { level: 6, title: "Film Critic", movies: 75 },
  { level: 7, title: "Cinema Legend", movies: 100 },
];

const STREAMING_SERVICES = [
  { name: "Netflix", logo: "N", color: "#E50914" },
  { name: "Disney+", logo: "D+", color: "#113CCF" },
  { name: "HBO Max", logo: "HBO", color: "#6C5CE7" },
  { name: "Amazon Prime", logo: "P", color: "#00A8E1" },
  { name: "Hulu", logo: "H", color: "#1CE783" },
  { name: "Apple TV+", logo: "TV+", color: "#000000", isApple: true },
  { name: "Paramount+", logo: "P+", color: "#0064FF" },
  { name: "Peacock", logo: "P", color: "#6C2C91" },
  { name: "Showtime", logo: "SHO", color: "#FF0000" },
];

const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressFill, { width: `${value}%` }]} />
  </View>
);

const AppleIcon = ({ color, size = 28 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
);

export default function ProfileScreen() {
  const { userData, updateUserData, setCurrentScreen } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>(userData?.streamingServices || []);
  const [isLevelsModalVisible, setLevelsModalVisible] = useState(false);

  const currentLevel = LEVELS.find((l) => l.level === (userData?.level || 1)) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === (userData?.level || 1) + 1);
  const moviesWatched = userData?.watchedMovies?.length || 0;
  const progress = nextLevel
    ? ((moviesWatched - currentLevel.movies) / (nextLevel.movies - currentLevel.movies)) * 100
    : 100;

  function toggleService(serviceName: string) {
    const updatedServices = selectedServices.includes(serviceName)
      ? selectedServices.filter((s) => s !== serviceName)
      : [...selectedServices, serviceName];
    setSelectedServices(updatedServices);
    updateUserData({ streamingServices: updatedServices });
  }

  function handleRetakeQuiz() {
    setCurrentScreen("quiz");
  }

  function handleLogout() {
    setCurrentScreen("auth");
  }

  //SMALL FUNCTIONS THAT RETURN UI SECTIONS
  function renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
    );
  }

  function renderUserCard() {
    return (
      <View style={styles.card}>
        <View style={styles.userInfoHeader}>
          <View style={styles.avatar}>
            <User color="white" size={32} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.username}>{userData?.username || "Guest"}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderLevelsCard() {
    return (
      <View style={styles.card}>
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
    );
  }

  function renderServicesCard() {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderIcon}>
          <Tv color="#5C7AB8" size={20} />
          <Text style={styles.cardTitle}>My Streaming Services</Text>
        </View>
        <View style={styles.servicesGrid}>
          {STREAMING_SERVICES.map((service) => {
            const isSelected = selectedServices.includes(service.name);
            return (
              <TouchableOpacity key={service.name} onPress={() => toggleService(service.name)} style={[styles.serviceTile, isSelected && styles.serviceTileSelected]}>
                {service.isApple ? (
                  <AppleIcon color={isSelected ? "#FFFFFF" : service.color} />
                ) : (
                  <Text style={[styles.serviceLogo, { color: isSelected ? "#FFFFFF" : service.color }]}>{service.logo}</Text>
                )}
                <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>{service.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderNotifications() {
    return (
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
            trackColor={{ false: "#2a2a4a", true: "#5C7AB8" }}
            thumbColor={notifications ? "#ffffff" : "#f4f3f4"}
            onValueChange={setNotifications}
            value={notifications}
          />
        </View>
      </View>
    );
  }

  //MAIN RETURN CALLING SECTION FUNCTIONS!
  return (
    <LinearGradient colors={["#000000", "#0a0a1a", "#000000"]} style={styles.flex1}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.container}>
        {renderHeader()}
        {renderUserCard()}
        {renderLevelsCard()}
        {renderServicesCard()}
        {renderNotifications()}
      </ScrollView>
    </LinearGradient>
  );
}
