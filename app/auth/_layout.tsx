import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false,
            animation: 'fade',
        }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}