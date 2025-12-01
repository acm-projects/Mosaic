import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: 'transparent' }
        }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="join" options={{ headerShown: false }} />
            <Stack.Screen name="create" options={{ headerShown: false }} />
            <Stack.Screen name="invite" options={{ headerShown: false }} />
        </Stack>
    );
}
