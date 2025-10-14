import { LoadingPopup } from "@/components/loading_popup";
import { MosaicLogo } from "@/components/mosaic_logo";
import { TwinklingStar } from "@/components/twinkle_star";
import { sign_up } from "@/lib/firebase_auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native"; // Or use a react-native-vector-icons alternative
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const router = useRouter();
    const stars = useMemo(() =>
        [...Array(50)].map((_, i) => ({
            key: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animation_delay: Math.random() * 3
        })), []
    );

    const [email, set_email] = useState('');
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [confirm_password, set_confirm_password] = useState('');
    const [error, set_error] = useState('');
    const [loading, set_loading] = useState(false);

    function handle_singup() {
        if (!email || !username || !password || !confirm_password) {
            set_error('Please fill in all fields');
            return;
        }
        if (password !== confirm_password) {
            set_error('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            set_error('Password must be at least 8 characters');
            return;
        }

        set_loading(true);

        sign_up(email, password, username).then(result => {
            if (result === true) {
                router.replace('/quiz');
            } else {
                set_error(result as string);
            }
        }).finally(() => set_loading(false));
    };

    return (
        <SafeAreaView style={styles.container}>
            <LoadingPopup visible={loading} />

            {/* Background Gradient */}
            <LinearGradient
                colors={["#000", "#0a0a0a", "#000"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Stars */}
            <View style={styles.star_container}>
                {stars.map(star => (
                    <TwinklingStar
                        key={star.key}
                        left={star.left}
                        top={star.top}
                        animation_delay={star.animation_delay}
                    />
                ))}
            </View>

            {/* Gradient Blobs */}
            <View style={styles.gradient_blob_container}>
                <View style={[styles.gradient_blob, { top: "33%", right: "33%", backgroundColor: "#7B5CF0" }]} />
                <View style={[styles.gradient_blob, { bottom: "33%", left: "33%", backgroundColor: "#5C7AB8", opacity: 0.5 }]} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll_container} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity style={styles.back_button} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>

                {/* Logo */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 800, easing: Easing.bezier(0.23, 1, 0.32, 1) }}
                    style={{ alignItems: "center", marginBottom: 32 }}
                >
                    <MosaicLogo size="md" />
                    <Text style={styles.subtitle}>Set up your profile to get started</Text>
                </MotiView>

                {/* Form */}
                <View style={styles.form_container}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#94A3B8"
                        value={email}
                        onChangeText={text => { set_email(text); set_error(''); }}
                    />

                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Choose a display name"
                        placeholderTextColor="#94A3B8"
                        value={username}
                        onChangeText={text => { set_username(text); set_error(''); }}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password (min 8 characters)"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={password}
                        onChangeText={text => { set_password(text); set_error(''); }}
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter your password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={confirm_password}
                        onChangeText={text => { set_confirm_password(text); set_error(''); }}
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                        onPress={handle_singup}
                        style={[
                            styles.continue_button,
                            !(email && username && password && confirm_password) && styles.disabled_button
                        ]}
                    >
                        <Text style={styles.continue_text}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    scroll_container: { padding: 24, flexGrow: 1 },
    star_container: { ...StyleSheet.absoluteFillObject },
    gradient_blob_container: { ...StyleSheet.absoluteFillObject },
    gradient_blob: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.15,
    },
    back_button: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    subtitle: { color: "#CBD5E1", fontSize: 16, marginTop: 8, textAlign: "center" },
    form_container: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 24,
        padding: 24,
        marginTop: 24,
    },
    label: { color: "#94A3B8", marginBottom: 8, fontWeight: "500" },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        marginBottom: 16,
        paddingHorizontal: 12,
        color: "white",
        backgroundColor: "rgba(255,255,255,0.1)"
    },
    error: { color: "#f87171", textAlign: "center", marginBottom: 12 },
    continue_button: {
        backgroundColor: "#7B9ED9",
        borderRadius: 12,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    disabled_button: { opacity: 0.6 },
    continue_text: { color: "white", fontWeight: "bold", fontSize: 16 },
});

