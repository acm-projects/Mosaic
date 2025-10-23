import { Feather } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";

// --- Calendar Component (Mock - non-functional date picker) ---
// Note: This is a non-functional placeholder for the date picker component,
// as integrating complex web libraries like react-day-picker is not viable in core RN.

export function Calendar({ className, ...props }) {
  return (
    <View style={cn(styles.calendarContainer, className)} {...props}>
        <View style={styles.header}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" style={styles.navButton} />
            <Text style={styles.captionLabel}>October 2025</Text>
            <Feather name="chevron-right" size={24} color="#FFFFFF" style={styles.navButton} />
        </View>
        <Text style={styles.mockText}>[Calendar Component Mock]</Text>
        <Text style={styles.mockTextSmall}>Use an external library like react-native-calendars for full functionality.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    calendarContainer: {
        padding: 12,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        alignItems: 'center',
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    captionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    navButton: {
        color: '#9CA3AF',
        padding: 8,
    },
    mockText: {
        color: '#5C7AB8',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    mockTextSmall: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    }
}); 