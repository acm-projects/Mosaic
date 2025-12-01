import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ 
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false,
            animation: 'fade',
        }}>
            <Stack.Screen name="quiz" />
            <Stack.Screen name="movie_tinder" />
        </Stack>
    );
}