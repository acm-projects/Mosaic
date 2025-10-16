import { auth } from "@/lib/firebase_config";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomePage() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home Page</Text>
            <TouchableOpacity onPress={() => {
                signOut(auth).then(() => {
                    router.navigate('/login');
                })
            }} style={{marginTop: 20, padding: 10, backgroundColor: 'blue'}}> Sign out </TouchableOpacity>
        </View>
    );
}