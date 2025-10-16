import GoogleSVG from '@/assets/svg/google.svg';
import { LoadingPopup } from '@/components/loading_popup';
import { MosaicLogo } from '@/components/mosaic_logo';
import { TwinklingStar } from '@/components/twinkle_star';
import { login } from '@/lib/firebase_auth';
import { auth } from '@/lib/firebase_config';
import { get_user_data } from '@/lib/firebase_firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiText, MotiView } from 'moti';
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();
    const stars = useMemo(() =>
        [...Array(50)].map((_, i) => ({
            key: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animation_delay: Math.random() * 3
        })), []
    );

    const [pressed_signin, set_pressed_signin] = useState(false);
    const [pressed_google, set_pressed_google] = useState(false);
    const [loading, set_loading] = useState(false);

    const [email, set_email] = useState("");
    const [password, set_password] = useState("");

    const [error_message, set_error_message] = useState("");
    const [error_visible, set_error_visible] = useState(false);

    function handle_login(): void {
        if (email === "" || password === "") {
            set_error_message("Please fill in all fields.");
            set_error_visible(true);
            return;
        }

        set_loading(true);

        login(email, password).then((result) => {
            if (result === true) {
                const user = auth.currentUser;
                const user_data = get_user_data(user!.uid);

                user_data.then((data) => {
                    if (typeof(data) == "object" && !data?.taken_quiz) {
                        router.replace("/quiz");
                    } else {
                        router.replace("/home");
                    }
                });
            } else {
                set_error_message(result as string);
                set_error_visible(true);
            }
        }).finally(() => {
            set_loading(false);
        });
    }

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
                        {/* Email/Username Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={styles.inputs_label}>
                                Email or Username
                            </Text>
                            <TextInput
                                placeholder="Enter your email or username"
                                placeholderTextColor="#64748B"
                                style={styles.login_inputs}
                                value={email}
                                onChangeText={set_email}
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
                            onPressIn={() => set_pressed_signin(true)}
                            onPressOut={() => set_pressed_signin(false)}
                            onPress={handle_login}
                            activeOpacity={1}
                        >
                            <LinearGradient
                                colors={pressed_signin ? ["#4338ca", "#4f46e5"] : ["#4f46e5", "#6366f1"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.primary_button}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={{ marginVertical: 32, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: "#334155" }} />
                            <Text style={{ marginHorizontal: 12, color: "#64748B", fontWeight: "500" }}>
                                Or continue with
                            </Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: "#334155" }} />
                        </View>

                        {/* Google Button */}
                        <View style={{ gap: 12 }}>
                            <TouchableOpacity
                                style={[
                                    styles.google_button_base,
                                    pressed_google ? styles.google_button_hover : styles.google_button
                                ]}
                                onPressIn={() => set_pressed_google(true)}
                                onPressOut={() => set_pressed_google(false)}
                                // onPress={handle_google_signin}
                                activeOpacity={1}
                            >
                                <GoogleSVG width={20} height={20} style={{ marginRight: 12 }} />
                                <Text style={{ color: "white", fontWeight: "500" }}>
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <MotiText
                            style={{
                                textAlign: "center",
                                marginTop: 16,
                                color: "#64748B",
                                fontSize: 14,
                            }}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 500 }}
                        >
                            Don't have an account?{' '}
                            <Text
                                style={{ color: "#818cf8", fontWeight: "500" }}
                                onPress={() => router.push("/signup")}
                            >
                                Sign up
                            </Text>
                        </MotiText>
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
