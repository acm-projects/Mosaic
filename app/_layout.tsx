import PageBackground from "@/components/page_background";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
    return (
        <View style={styles.container}>
            <PageBackground />
            <Stack screenOptions={{
                contentStyle: { backgroundColor: 'transparent' }
            }}>
                <Stack.Screen name="home/(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="groups" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});