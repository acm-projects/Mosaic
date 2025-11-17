import GoogleSVG from '@/assets/svg/google.svg';
import AuthButton from "@/components/auth_button";
import AuthInput from '@/components/auth_input';
import LoadingPopup from '@/components/loading_popup';
import MosaicLogo from '@/components/mosaic_logo';
import PageBackground from '@/components/page_background';
import { login } from '@/lib/auth';
import { get_user_data } from '@/lib/firestore/users';
import { styles } from '@/lib/styles';
import { useRouter } from 'expo-router';
import { MotiText, MotiView } from 'moti';
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();

    const [pressed_google, set_pressed_google] = useState(false);
    const [loading, set_loading] = useState(false);

    const [email, set_email] = useState("");
    const [password, set_password] = useState("");

    const [error_message, set_error_message] = useState("");

    async function handle_login(): Promise<void> {
        set_error_message("");
    
        if (!email || !password) {
            set_error_message("Please fill in all fields.");
            return;
        }
    
        set_loading(true);
    
        try {
            const result = await login(email, password);
    
            if (!result.ok) {
                set_error_message(result.error);
                return;
            }
    
            const user = result.data;
    
            const user_data = await get_user_data(user.uid);
    
            if (typeof user_data === "string") {
                set_error_message(user_data);
                return;
            }
    
            if (user_data && !user_data.taken_quiz) {
                router.replace("/onboarding/quiz");
            } else {
                router.replace("/home");
            }
        } catch (err) {
            set_error_message("An unexpected error occurred.");
        } finally {
            set_loading(false);
        }
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <LoadingPopup visible={loading} />

            {/* Background Gradient */}
            <PageBackground />

            {/* Login Container */}
            <View style={styles.login_container}>
                {/* Logo and Subtitle */}
                <MosaicLogo size="lg" />

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
                        <AuthInput
                            label="Email or Username"
                            placeholder="Enter your email or username"
                            value={email}
                            onChangeText={set_email}
                        />

                        {/* Password Input */}
                        <AuthInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={set_password}
                            secureTextEntry={true}
                        />

                        {error_message != "" && <View style={{ marginBottom: 10, alignItems: "center" }}>
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
                        <AuthButton onPress={handle_login} text='Sign In' />

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
                                onPress={() => router.navigate("/auth/signup")}
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