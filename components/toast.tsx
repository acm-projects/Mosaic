import { CheckCircle, Info, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type: ToastType;
    duration?: number;
    onHide: () => void;
}

export function Toast({ visible, message, type, duration = 3000, onHide }: ToastProps) {
    const fade_anim = useRef(new Animated.Value(0)).current;
    const translate_y = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fade_anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translate_y, {
                    toValue: 0,
                    tension: 65,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hide_toast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    function hide_toast() {
        Animated.parallel([
            Animated.timing(fade_anim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translate_y, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    if (!visible) return null;

    const background_color = 
        type === 'success' ? '#10b981' : 
        type === 'error' ? '#ef4444' : 
        '#818cf8';
    
    const Icon = 
        type === 'success' ? CheckCircle : 
        type === 'error' ? XCircle : 
        Info;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fade_anim,
                    transform: [{ translateY: translate_y }],
                },
            ]}
        >
            <View style={[styles.toast, { backgroundColor: background_color }]}>
                <Icon size={20} color="#ffffff" />
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
}

export function useToast() {
    const [toastConfig, setToastConfig] = React.useState<{
        visible: boolean;
        message: string;
        type: ToastType;
    }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const show = (message: string, type: ToastType = 'success') => {
        setToastConfig({ visible: true, message, type });
    };

    const hide = () => {
        setToastConfig(prev => ({ ...prev, visible: false }));
    };

    return {
        toastConfig,
        showSuccess: (message: string) => show(message, 'success'),
        showError: (message: string) => show(message, 'error'),
        showInfo: (message: string) => show(message, 'info'),
        hideToast: hide,
    };
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 16,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 10,
        minWidth: 200,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    message: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});