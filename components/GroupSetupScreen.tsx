import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RNButton, RNInput } from '../components/UI';
import { useApp } from '../context/AppContext.tsx/AppContext';
import { groupColors, initialGroup } from '../data/Mocks';
import { copyToClipboard } from '../utils/Utils';

// --- GroupSetupScreen Component (Originally GroupSetupScreen.tsx) ---
export const GroupSetupScreen = () => {
  const { setCurrentScreen, updateUserData, userData, previousScreen } = useApp();
  const [action, setAction] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState(groupColors[0]);
  const [joinCode, setJoinCode] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const insets = useSafeAreaInsets();
  
  const isOnboarding = previousScreen === 'swipe'; // Mocked previous screen for onboarding flow

  const handleCreateGroup = () => {
    if (groupName) {
      const newGroupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const newGroup = {
        id: Date.now().toString(),
        name: groupName,
        avatar: 'https://placehold.co/100x100/5C7AB8/ffffff?text=GROUP',
        color: selectedColor,
        members: ['You'],
        sharedMovies: [],
        pendingInvites: []
      };
      
      updateUserData({ groups: [...(userData?.groups || []), newGroup] });
      setGroupCode(newGroupCode);
      setAction('invite');
    } else {
        Alert.alert("Error", "Please enter a group name.");
    }
  };

  const handleJoinGroup = () => {
    if (joinCode && joinCode.length === 6) {
      // Mock joining a group with a code
      const joinedGroup = { ...initialGroup, id: joinCode, name: "Joined Group" };
      updateUserData({ groups: [...(userData?.groups || []), joinedGroup] });
      setCurrentScreen('home');
    } else {
      Alert.alert("Error", "Please enter a valid 6-character group code.");
    }
  };

  const copyGroupCode = async () => {
    await copyToClipboard(groupCode);
  };

  const handleBack = () => {
    if (action === 'invite') {
      setCurrentScreen('home');
    } else if (action) {
      setAction(null);
    } else {
      // If came from onboarding, go home, otherwise go back to groups screen
      setCurrentScreen(isOnboarding ? 'home' : 'groups');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity onPress={handleBack} style={[styles.backButton, { top: insets.top + 16 }]}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.innerContent}>
          {action === null ? (
            <View style={styles.initialState}>
              <View style={styles.iconContainer}>
                <Feather name="users" size={60} color="#fff" />
              </View>
              <Text style={styles.title}>Watch Together</Text>
              <Text style={styles.subtitle}>Create or join a group to get recommendations based on everyone's taste</Text>

              <View style={styles.actionsContainer}>
                <RNButton
                  onPress={() => setAction('create')}
                  title="Create a Group"
                  style={styles.mainButton}
                >
                  <Feather name="plus" size={20} color="#fff" style={{ marginRight: 8 }} />
                </RNButton>
                <RNButton
                  onPress={() => setAction('join')}
                  title="Join Existing Group"
                  variant="outline"
                  style={styles.outlineButton}
                />
                {isOnboarding && (
                  <TouchableOpacity onPress={() => setCurrentScreen('home')}>
                    <Text style={styles.skipText}>Skip for now</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : action === 'create' ? (
            <View style={styles.formState}>
              <Text style={styles.title}>Create Your Group</Text>
              
              {/* Preview */}
              <View style={[styles.previewCircle, { backgroundColor: selectedColor }]}>
                <Feather name="users" size={40} color="#fff" />
              </View>

              {/* Color Picker */}
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorPickerLabel}>Choose a color</Text>
                <View style={styles.colorPickerGrid}>
                  {groupColors.map(color => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorOption, 
                        { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 1, borderColor: selectedColor === color ? '#fff' : '#4b5563' }
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Group Name */}
              <RNInput
                placeholder="Group name (e.g., Movie Night Crew)"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.inputStyle}
              />
              <RNButton
                onPress={handleCreateGroup}
                title="Create Group"
                style={[styles.mainButton, { marginTop: 16, backgroundColor: groupName ? '#7B9ED9' : '#5C7AB880' }]}
                disabled={!groupName}
              />
            </View>
          ) : action === 'join' ? (
            <View style={styles.formState}>
              <Text style={styles.title}>Join a Group</Text>
              <Text style={styles.subtitle}>Enter the group code</Text>

              <RNInput
                placeholder="Enter group code (e.g., ABC123)"
                value={joinCode}
                onChangeText={(text) => setJoinCode(text.toUpperCase())}
                style={[styles.inputStyle, styles.joinCodeInput]}
                maxLength={6}
              />
              <RNButton
                onPress={handleJoinGroup}
                title="Join Group"
                style={[styles.mainButton, { marginTop: 16, backgroundColor: joinCode.length === 6 ? '#7B9ED9' : '#7B9ED999' }]}
                disabled={joinCode.length !== 6}
              />
            </View>
          ) : action === 'invite' ? (
            <View style={styles.formState}>
              <View style={styles.iconContainer}>
                <Feather name="users" size={40} color="#fff" />
              </View>
              <Text style={styles.title}>Group Created!</Text>
              <Text style={styles.subtitle}>Share this code with friends</Text>
              
              <View style={styles.inviteCodeBox}>
                <Text style={styles.inviteCodeText}>{groupCode}</Text>
                <RNButton
                  onPress={copyGroupCode}
                  title="Copy Invite Code"
                  variant="outline"
                  style={styles.copyCodeButton}
                >
                  <Feather name="copy" size={16} color="#fff" style={{ marginRight: 8 }} />
                </RNButton>
              </View>

              <RNButton
                onPress={() => setCurrentScreen('home')}
                title="Continue to Home"
                style={[styles.mainButton, { marginTop: 16 }]}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        position: 'absolute',
        left: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff26',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#ffffff33',
    },
    innerContent: {
        flex: 1,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#ffffffb3',
        textAlign: 'center',
        marginBottom: 32,
    },
    
    // Initial State
    initialState: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#5C7AB8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40,
    },
    actionsContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    mainButton: {
        height: 48,
        backgroundColor: '#7B9ED9',
    },
    outlineButton: {
        height: 48,
        backgroundColor: '#ffffff1a',
        borderColor: '#ffffff33',
    },
    skipText: {
        color: '#9ca3af',
        textAlign: 'center',
        paddingVertical: 12,
    },

    // Form States (Create, Join, Invite)
    formState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
        gap: 16,
    },
    inputStyle: {
        width: '100%',
        height: 48,
    },
    previewCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    colorPickerContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 16,
    },
    colorPickerLabel: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    colorPickerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    // Join Code Input
    joinCodeInput: {
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 4,
        fontWeight: 'bold',
    },

    // Invite State
    inviteCodeBox: {
        backgroundColor: '#ffffff0d',
        borderWidth: 1,
        borderColor: '#ffffff1a',
        borderRadius: 8,
        padding: 24,
        width: '100%',
        gap: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    inviteCodeText: {
        fontSize: 24,
        color: '#fff',
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    copyCodeButton: {
        width: '100%',
        backgroundColor: '#ffffff1a',
        borderColor: '#ffffff33',
    },
});