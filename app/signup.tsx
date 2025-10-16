// Refactored SignUp screen with consistent UI, error handling, and real-time validation
import { LoadingPopup } from "@/components/loading_popup";
import { MosaicLogo } from "@/components/mosaic_logo";
import { TwinklingStar } from "@/components/twinkle_star";
import { sign_up } from "@/lib/firebase_auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const router = useRouter();
    const stars = useMemo(() =>
        [...Array(50)].map((_, i) => ({ key: i, left: Math.random() * 100, top: Math.random() * 100, animation_delay: Math.random() * 3 })), []
    );

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pressedSignup, setPressedSignup] = useState(false);

    // Real-time validation
    useEffect(() => {
        if (!email || !username || !password || !confirmPassword) {
            setErrorMessage('');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
        } else if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters');
        } else {
            setErrorMessage('');
        }
    }, [email, username, password, confirmPassword]);

    async function handleSignup() {
        if (errorMessage) return;
        if (!email || !username || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            const result = await sign_up(email, password, username);
            if (result === true) router.replace('/quiz');
            else if (typeof (result) == "string") setErrorMessage(result);
        } catch (error) {
            setErrorMessage('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <LoadingPopup visible={loading} />
            <LinearGradient colors={["#000000", "#0f172a", "#1e1b4b"]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.star_container}>
                {stars.map((star) => (<TwinklingStar key={star.key} left={star.left} top={star.top} animation_delay={star.animation_delay} />))}
            </View>
            <View style={styles.login_container}>
                <ArrowLeft size={24} color={"white"} style={{ position: "absolute", top: 40, left: 20, zIndex: 20 }} onPress={() => { router.back() }} />
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 800, easing: Easing.bezier(0.23, 1, 0.32, 1) }} style={{ alignItems: "center", marginBottom: 64 }}>
                    <View style={{ marginBottom: 24 }}><MosaicLogo size="lg" /></View>
                    <Text style={{ color: "rgb(148, 163, 184)", fontSize: 20, fontWeight: "300" }}>Discover what to watch together</Text>
                </MotiView>
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 800, delay: 200, easing: Easing.bezier(0.23, 1, 0.32, 1) }} style={{ width: "100%", gap: 12 }}>
                    <View style={styles.form_container}>
                        <Field label="Email" value={email} onChange={setEmail} placeholder="Enter your email" />
                        <Field label="Username" value={username} onChange={setUsername} placeholder="Enter your username" />
                        <Field label="Password" value={password} onChange={setPassword} placeholder="Enter your password" secure />
                        <Field label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm password" secure />
                        {errorMessage ? <Text style={{
                            color: "#c10007",
                            fontWeight: "semibold",
                            fontSize: 12,
                            opacity: 0.75,
                        }}>{errorMessage}</Text> : null}
                        <TouchableOpacity onPressIn={() => setPressedSignup(true)} onPressOut={() => setPressedSignup(false)} onPress={handleSignup} activeOpacity={1}>
                            <LinearGradient colors={pressedSignup ? ["#4338ca", "#4f46e5"] : ["#4f46e5", "#6366f1"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primary_button}>
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </MotiView>
            </View>
        </SafeAreaView>
    );
}

function Field({ label, value, onChange, placeholder, secure }: { label: string; value: string; onChange: (text: string) => void; placeholder: string; secure?: boolean }) {
    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={styles.inputs_label}>{label}</Text>
            <TextInput placeholder={placeholder} placeholderTextColor="#64748B" style={styles.login_inputs} value={value} onChangeText={onChange} secureTextEntry={secure} />
        </View>
    );
}

// TODO: Finalize styles to match Login exactly
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
