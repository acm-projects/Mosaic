import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const button_styles = StyleSheet.create({
    primary: {
        borderRadius: theme.borderRadius.sm,
        borderWidth: 0,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: theme.shadows.sm,
        width: "100%",
        shadowColor: theme.shadows.accent,
    },
    googleBase: {
        borderRadius: theme.borderRadius.sm,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
    },
    google: {
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.border.hover,
    },
    googleHover: {
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: theme.colors.border.accent,
        shadowColor: theme.shadows.googleAccent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
});