import AuthButton from "@/components/auth_button";
import AuthInput from "@/components/auth_input";
import LoadingPopup from "@/components/loading_popup";
import MosaicLogo from "@/components/mosaic_logo";
import PageBackground from "@/components/page_background";
import { sign_up } from "@/lib/auth";
import { base_styles, form_styles, theme } from "@/lib/styles";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const [email, set_email] = useState("");
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const [confirm_password, set_confirm_password] = useState("");

    const [error_message, set_error_message] = useState("");
    const [loading, set_loading] = useState(false);

    useEffect(() => {
        if (!email || !username || !password || !confirm_password) {
            set_error_message("");
            return;
        }
        if (password !== confirm_password) {
            set_error_message("Passwords do not match");
        } else if (password.length < 8) {
            set_error_message("Password must be at least 8 characters");
        } else {
            set_error_message("");
        }
    }, [email, username, password, confirm_password]);

    async function handle_signup() {
        if (error_message) return;

        if (!email || !username || !password) {
            set_error_message("Please fill in all fields");
            return;
        }

        set_loading(true);

        try {
            const result = await sign_up(email, password, username);

            if (!result.ok) {
                set_error_message(result.error);
                return;
            }

            router.replace("/onboarding/quiz");
        } catch (error) {
            set_error_message("Something went wrong. Try again.");
        } finally {
            set_loading(false);
        }
    }

    return (
        <SafeAreaView style={base_styles.container}>
            <LoadingPopup visible={loading} />
            <PageBackground />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={base_styles.centerContainer}>
                        <ArrowLeft
                            size={24}
                            color={"white"}
                            style={styles.backButton}
                            onPress={() => router.back()}
                        />

                        <MosaicLogo size="lg" />

                        <MotiView
                            from={{ opacity: 0, translateY: 30 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{
                                type: "timing",
                                duration: 800,
                                delay: 200,
                                easing: Easing.bezier(0.23, 1, 0.32, 1),
                            }}
                            style={styles.formWrapper}
                        >
                            <View style={form_styles.container}>
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    onChangeText={set_email}
                                    placeholder="Enter your email"
                                />
                                <AuthInput
                                    label="Username"
                                    value={username}
                                    onChangeText={set_username}
                                    placeholder="Enter your username"
                                />
                                <AuthInput
                                    label="Password"
                                    value={password}
                                    onChangeText={set_password}
                                    placeholder="Enter your password"
                                    secureTextEntry
                                />
                                <AuthInput
                                    label="Confirm Password"
                                    value={confirm_password}
                                    onChangeText={set_confirm_password}
                                    placeholder="Confirm your password"
                                    secureTextEntry
                                />

                                {error_message ? (
                                    <Text style={form_styles.errorText}>
                                        {error_message}
                                    </Text>
                                ) : null}

                                <AuthButton onPress={handle_signup} text='Sign Up' />
                            </View>
                        </MotiView>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingBottom: theme.spacing.xxxl,
    },
    backButton: {
      position: "absolute",
      top: theme.spacing.xxxl,
      left: 20,
      zIndex: 20,
    },
    formWrapper: {
      width: "100%",
      gap: theme.spacing.md,
    },
  });