import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

export default function LoadingPopup({ visible }: { visible: boolean }) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    loaderBox: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: "white",
    },
});
