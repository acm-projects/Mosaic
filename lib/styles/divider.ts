import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const divider_styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing.xxl,
        flexDirection: "row",
        alignItems: "center",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border.default,
    },
    text: {
        marginHorizontal: theme.spacing.md,
        color: theme.colors.text.muted,
        fontWeight: "500",
    },
});