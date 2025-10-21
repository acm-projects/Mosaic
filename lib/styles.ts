import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
        position: "relative",
    },
    login_container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 6,
        zIndex: 10
    },
    login_inputs: {
        backgroundColor: "rgba(30,41,59,0.5)",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        height: 48,
        color: "white",
        paddingHorizontal: 12,
    },
    form_container: {
        backgroundColor: "rgba(30,41,59,0.1)",
        borderWidth: 1,
        borderColor: "rgba(99,102,241,0.2)",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    inputs_label: {
        color: "#CBD5E1",
        fontWeight: "500",
        marginBottom: 8
    },
    primary_button: {
        borderRadius: 12,
        borderWidth: 0,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        width: "100%",
        shadowColor: "rgba(102, 126, 234, 0.25)"
    },
    google_button_base: {
        borderRadius: 12,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
    },
    google_button: {
        backgroundColor: "rgba(30, 41, 59, 0.3)",
        borderColor: "rgb(51, 65, 85)",
    },
    google_button_hover: {
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: "rgb(99, 102, 241)",
        shadowColor: "rgba(99, 102, 241, 0.25)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    star_container: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    },
});
