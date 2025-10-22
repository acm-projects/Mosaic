import PageBackground from "@/components/page_background";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinGroupScreen() {
    return (
        <SafeAreaView style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <PageBackground />

            <View style={local.container}>
                
            </View>
        </SafeAreaView>
    );
}

const local = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 48,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#6b8fe4",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "white",
        marginBottom: 6,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#94A3B8",
        marginBottom: 24,
        textAlign: "center",
    },
    createButton: {
        flexDirection: "row",
        backgroundColor: "#6b8fe4",
        width: "auto",
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 0,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        shadowColor: "rgba(102, 126, 234, 0.25)",
        marginBottom: 12,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});