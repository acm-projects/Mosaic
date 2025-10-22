import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="groups" options={{ headerShown: false }} />
            <Stack.Screen name="quiz" options={{ headerShown: false }} />
        </Stack>
    );
}
