import PageBackground from "@/components/page_background";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
    return (
        <View style={styles.container}>
            <PageBackground />
            <Stack screenOptions={{
                contentStyle: { backgroundColor: 'transparent' },
                headerShown: false,
                animation: 'slide_from_right'
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="home/(tabs)" />
                <Stack.Screen name="groups" />
                <Stack.Screen name="movie" />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});