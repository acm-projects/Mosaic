import { StyleSheet } from "react-native";

export const base_styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
        position: "relative",
    },
    center_container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    absolute_fill: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    },
});