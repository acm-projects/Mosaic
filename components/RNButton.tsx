import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function RNButton(
    { title, onPress }: { title: string, onPress?: () => void }
) {
    const [pressed_signin, set_pressed_signin] = useState(false);

    function handle_press() {
        if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPressIn={() => set_pressed_signin(true)}
            onPressOut={() => set_pressed_signin(false)}
            onPress={handle_press}
            activeOpacity={1}
        >
            <LinearGradient
                colors={pressed_signin ? ["#4338ca", "#4f46e5"] : ["#4f46e5", "#6366f1"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.primary_button}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primary_button: {
        borderRadius: 12,
        borderWidth: 0,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        width: "100%",
        shadowColor: "rgba(102, 126, 234, 0.25)"
    },
});