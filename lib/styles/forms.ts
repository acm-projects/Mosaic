import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const form_styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background.container,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xxl,
        boxShadow: theme.shadows.md,
    },
    inputContainer: {
        width: "100%",
        gap: theme.spacing.md,
    },
    input: {
        backgroundColor: theme.colors.background.primary,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.borderRadius.sm,
        height: 48,
        color: theme.colors.text.primary,
        paddingHorizontal: theme.spacing.md,
    },
    label: {
        color: theme.colors.text.secondary,
        fontWeight: "500",
        marginBottom: theme.spacing.sm,
    },
    errorContainer: {
        marginBottom: 10,
        alignItems: "center",
    },
    errorText: {
        color: theme.colors.text.error,
        fontWeight: "600",
        fontSize: 12,
        opacity: 0.75,
    },
});