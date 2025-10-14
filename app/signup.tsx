import { LoadingPopup } from "@/components/loading_popup";
import { MosaicLogo } from "@/components/mosaic_logo";
import { TwinklingStar } from "@/components/twinkle_star";
import { sign_up } from "@/lib/firebase_auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    const [error_message, set_error] = useState('');
    const [error_visible, set_error_visible] = useState(false);
    const [loading, set_loading] = useState(false);
    const [pressed_signup, set_pressed_signup] = useState(false);

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
                colors={["#000000", "#0f172a", "#1e1b4b"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Stars */}
            <View style={styles.star_container}>
                {stars.map((star) => (
                    <TwinklingStar
                        key={star.key}
                        left={star.left}
                        top={star.top}
                        animation_delay={star.animation_delay}
                    />
                ))}
            </View>

            {/* Login Container */}
            <View style={styles.login_container}>
                {/* Logo and Subtitle */}
                <MotiView
                    from={{ opacity: 0, transform: [{ translateY: 20 }] }}
                    animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
                    transition={{ type: "timing", duration: 800, easing: Easing.bezier(0.23, 1, 0.32, 1) }}
                    style={{
                        alignItems: "center",
                        marginBottom: 64
                    }}
                >
                    <View style={{ marginBottom: 24 }}>
                        <MosaicLogo size="lg" />
                    </View>
                    <Text style={{ color: "rgb(148, 163, 184)", fontSize: 20, fontWeight: "light" }}>Discover what to watch together</Text>
                </MotiView>

                {/* Form */}
                <MotiView
                    from={{ opacity: 0, transform: [{ translateY: 30 }] }}
                    animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
                    transition={{ type: "timing", duration: 800, delay: 200, easing: Easing.bezier(0.23, 1, 0.32, 1) }}
                    style={{
                        width: "100%",
                        gap: 12,
                    }}
                >
                    <View style={styles.form_container}>
                        {/* Email Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.inputs_label}>
                                Email
                            </Text>
                            <TextInput
                                placeholder="Enter your email"
                                placeholderTextColor="#64748B"
                                style={styles.login_inputs}
                                value={email}
                                onChangeText={set_email}
                            />
                        </View>

                        {/* Username Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.inputs_label}>
                                Username
                            </Text>
                            <TextInput
                                placeholder="Enter your username"
                                placeholderTextColor="#64748B"
                                style={styles.login_inputs}
                                value={username}
                                onChangeText={set_username}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.inputs_label}>
                                Password
                            </Text>
                            <TextInput
                                placeholder="Enter your password"
                                placeholderTextColor="#64748B"
                                secureTextEntry
                                style={styles.login_inputs}
                                value={password}
                                onChangeText={set_password}
                            />
                        </View>

                        {/* Confifrm Password Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.inputs_label}>
                                Confirm Password
                            </Text>
                            <TextInput
                                placeholder="Confirm password"
                                placeholderTextColor="#64748B"
                                secureTextEntry
                                style={styles.login_inputs}
                                value={confirm_password}
                                onChangeText={set_confirm_password}
                            />
                        </View>

                        {error_visible && <View style={{ marginBottom: 10, alignItems: "center" }}>
                            <Text style={{
                                color: "#c10007",
                                fontWeight: "semibold",
                                fontSize: 12,
                                opacity: 0.75,
                            }}>
                                {error_message}
                            </Text>
                        </View>}

                        {/* Login Button */}
                        <TouchableOpacity
                            onPressIn={() => set_pressed_signup(true)}
                            onPressOut={() => set_pressed_signup(false)}
                            onPress={handle_singup}
                            activeOpacity={1}
                        >
                            <LinearGradient
                                colors={pressed_signup ? ["#4338ca", "#4f46e5"] : ["#4f46e5", "#6366f1"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.primary_button}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </MotiView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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