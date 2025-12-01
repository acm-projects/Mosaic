import { theme } from "@/lib/styles";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function BackButton() {
    return (
        <View style={styles.back_button}>
            <ArrowLeft
                size={24}
                color={"white"}
                onPress={() => {
                    router.back();
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    back_button: {
        position: "absolute",
        top: theme.spacing.massive,
        left: theme.spacing.xxl,
        zIndex: 20,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.border_radius.full,
        padding: theme.spacing.md,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
})