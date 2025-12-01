import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: 'transparent' },
        }}>
            <Stack.Screen name="[movie_id]" />
        </Stack>
    );
}