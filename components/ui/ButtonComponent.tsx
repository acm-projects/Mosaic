import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface RNButtonProps {
  title: string;
  onPress: () => void;
}

export const RNButton: React.FC<RNButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

interface RNImageProps {
  src: string;
  alt: string;
  style: any;
}

export const RNImage: React.FC<RNImageProps> = ({ src, alt, style }) => {
  return null; // Replace with actual Image component
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});