import GoogleSVG from '@/assets/svg/google.svg';
import AuthButton from "@/components/auth_button";
import AuthInput from '@/components/auth_input';
import LoadingPopup from '@/components/loading_popup';
import MosaicLogo from '@/components/mosaic_logo';
import PageBackground from '@/components/page_background';
import { login } from '@/lib/auth';
import { get_user_data } from '@/lib/firestore/users';
import { base_styles, button_styles, divider_styles, form_styles, theme } from '@/lib/styles';
import { useRouter } from 'expo-router';
import { MotiText, MotiView } from 'moti';
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

            if (!user_data.ok) {
                set_error_message(user_data.error);
                return;
            }

            if (!user_data.data.taken_quiz) {
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
        <SafeAreaView style={base_styles.container}>
            <LoadingPopup visible={loading} />

            <PageBackground />

            <View style={[base_styles.centerContainer, styles.container]}>
                <MosaicLogo size="lg" />

                <MotiView
                    from={{ opacity: 0, transform: [{ translateY: 30 }] }}
                    animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        delay: 200,
                        easing: Easing.bezier(0.23, 1, 0.32, 1)
                    }}
                    style={styles.form_wrapper}
                >
                    <View style={form_styles.container}>
                        <AuthInput
                            label="Email or Username"
                            placeholder="Enter your email or username"
                            value={email}
                            onChangeText={set_email}
                        />

                        <AuthInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={set_password}
                            secureTextEntry={true}
                        />

                        {error_message !== "" && (
                            <View style={form_styles.errorContainer}>
                                <Text style={form_styles.errorText}>
                                    {error_message}
                                </Text>
                            </View>
                        )}

                        <AuthButton onPress={handle_login} text='Sign In' />

                        <View style={divider_styles.container}>
                            <View style={divider_styles.line} />
                            <Text style={divider_styles.text}>
                                Or continue with
                            </Text>
                            <View style={divider_styles.line} />
                        </View>

                        <View style={styles.google_button_container}>
                            <TouchableOpacity
                                style={[
                                    button_styles.googleBase,
                                    pressed_google ? button_styles.googleHover : button_styles.google
                                ]}
                                onPressIn={() => set_pressed_google(true)}
                                onPressOut={() => set_pressed_google(false)}
                                activeOpacity={1}
                            >
                                <GoogleSVG width={20} height={20} style={{ marginRight: 12 }} />
                                <Text style={{ color: "white", fontWeight: "500" }}>
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <MotiText
                            style={styles.signup_prompt}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 500 }}
                        >
                            Don't have an account?{' '}
                            <Text
                                style={styles.signup_link}
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

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.xs,
        zIndex: 10,
    },
    form_wrapper: {
        width: "100%",
        gap: theme.spacing.md,
    },
    google_button_container: {
        gap: theme.spacing.md,
    },
    signup_prompt: {
        textAlign: "center",
        marginTop: theme.spacing.lg,
        color: theme.colors.text.muted,
        fontSize: 14,
    },
    signup_link: {
        color: theme.colors.text.accent,
        fontWeight: "500",
    },
});