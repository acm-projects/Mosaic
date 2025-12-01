import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false,
            animation: 'fade'
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="join" />
            <Stack.Screen name="create" />
            <Stack.Screen name="invite" />
            <Stack.Screen name="[group_id]" />
        </Stack>
    );
}
