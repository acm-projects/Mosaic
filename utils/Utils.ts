import { Alert } from 'react-native';

export function showToast(message: string) {
  Alert.alert('', message); // Simple implementation using Alert for now
}