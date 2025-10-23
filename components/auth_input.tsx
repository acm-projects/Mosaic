import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    label?: string;
    placeholder: string;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: (text: string) => void;
};

export default function AuthInput({
    label,
    placeholder,
    secureTextEntry = false,
    value,
    onChangeText,
}: Props) {
    return (
        <View style={{ marginBottom: 24 }}>
            {label && <Text style={styles.inputs_label}>{label}</Text>}

            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#64748B"
                style={styles.login_inputs}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    login_inputs: {
        backgroundColor: "rgba(30,41,59,0.5)",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        height: 48,
        color: "white",
        paddingHorizontal: 12,
    },
    inputs_label: {
        color: "#CBD5E1",
        fontWeight: "500",
        marginBottom: 8
    },
});

