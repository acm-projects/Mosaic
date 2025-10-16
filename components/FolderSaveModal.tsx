import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showToast } from '../utils/Utils';
import { RNButton, RNInput } from './UI';

// --- Folder Save Modal ---
export const FolderSaveModal = ({ onClose, onSave, itemTitle, source }) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Mock existing folders
  const existingFolders = ['Favorites', 'To Watch', 'Action Movies', 'Marvel Collection'];

  const handleSaveToFolder = (folderName) => {
    onSave(folderName);
    showToast(`Saved to ${folderName}!`);
    onClose();
  };

  const handleCreateAndSave = () => {
    if (newFolderName.trim()) {
      handleSaveToFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    } else {
        Alert.alert("Error", "Folder name cannot be empty.");
    }
  };

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.folderModalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Save to Folder</Text>
              <Text style={styles.modalSubtitle}>Saving from {source.charAt(0).toUpperCase() + source.slice(1)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Feather name="x" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.itemPreview}>
            <Text style={styles.itemPreviewText} numberOfLines={1}>{itemTitle}</Text>
          </View>

          {!isCreatingFolder ? (
            <>
              <ScrollView style={styles.folderList}>
                {existingFolders.map((folder) => (
                  <TouchableOpacity
                    key={folder}
                    onPress={() => handleSaveToFolder(folder)}
                    style={styles.folderButton}
                  >
                    <Feather name="folder" size={16} color="#9ca3af" />
                    <Text style={styles.folderButtonText}>{folder}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setIsCreatingFolder(true)}
                style={styles.createNewFolderButton}
              >
                <Feather name="folder-plus" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.createNewFolderText}>Create New Folder</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.createFolderInputContainer}>
              <RNInput
                placeholder="Enter folder name"
                value={newFolderName}
                onChangeText={setNewFolderName}
                style={styles.inputStyleOverride}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCreateAndSave}
              />
              <View style={styles.createFolderActions}>
                <RNButton
                  onPress={handleCreateAndSave}
                  title="Create & Save"
                  style={styles.createSaveButton}
                  disabled={!newFolderName.trim()}
                />
                <RNButton
                  onPress={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  title="Cancel"
                  variant="outline"
                  style={styles.cancelButton}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    folderModalContent: {
        backgroundColor: '#0a0a1a',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalSubtitle: {
        color: '#9ca3af',
        fontSize: 14,
        marginTop: 4,
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ffffff1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPreview: {
        backgroundColor: '#ffffff0d',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        marginBottom: 16,
    },
    itemPreviewText: {
        color: '#fff',
        fontSize: 14,
    },
    folderList: {
        maxHeight: 256,
        marginBottom: 16,
    },
    folderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#2a2a4a',
        borderRadius: 8,
        marginBottom: 8,
    },
    folderButtonText: {
        color: '#fff',
        marginLeft: 12,
    },
    createNewFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#5C7AB8',
        borderRadius: 8,
    },
    createNewFolderText: {
        color: '#fff',
        marginLeft: 12,
        fontWeight: '600',
    },
    createFolderInputContainer: {
        gap: 12,
    },
    inputStyleOverride: {
      height: 48,
      backgroundColor: '#ffffff26', 
      borderColor: '#ffffff4d', 
      borderWidth: 1 
    },
    createFolderActions: {
        flexDirection: 'row',
        gap: 8,
    },
    createSaveButton: {
        flex: 1,
        backgroundColor: '#7B9ED9',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderColor: '#ffffff33',
        borderWidth: 1,
    },
});
