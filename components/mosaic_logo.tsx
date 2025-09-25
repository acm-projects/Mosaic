import { Film } from 'lucide-react-native';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface MosaicLogoProps {
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    className?: string;
}

const MosaicLogoComponent = memo(function MosaicLogoComponent({
    size = 'md',
    animated = true,
}: MosaicLogoProps) {
    const iconScale = useRef(new Animated.Value(1)).current;
    const iconRotate = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(1)).current;
    const textTranslate = useRef(new Animated.Value(0)).current;

    const sizes = {
        sm: { text: 18, icon: 16 },
        md: { text: 24, icon: 24 },
        lg: { text: 32, icon: 32 },
    };

    useEffect(() => {
        if (!animated) return;

        const animate = () => {
            // Reset values
            iconScale.setValue(0);
            iconRotate.setValue(-90);
            textOpacity.setValue(0);
            textTranslate.setValue(-20);

            // Icon animation
            Animated.parallel([
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(iconRotate, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(200),
                    Animated.parallel([
                        Animated.timing(textOpacity, {
                            toValue: 1,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                        Animated.timing(textTranslate, {
                            toValue: 0,
                            duration: 600,
                            easing: Easing.out(Easing.exp),
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]).start();
        };

        // Run first after 7s, then every 7s
        const timeout = setTimeout(() => {
            animate();
            const interval = setInterval(animate, 7000);
            return () => clearInterval(interval);
        }, 7000);

        return () => clearTimeout(timeout);
    }, [animated]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    transform: [
                        { scale: iconScale },
                        {
                            rotate: iconRotate.interpolate({
                                inputRange: [-90, 0],
                                outputRange: ['-90deg', '0deg'],
                            }),
                        },
                    ],
                }}
            >
                <Film size={sizes[size].icon} color="#6366F1" />
            </Animated.View>

            <Animated.Text
                style={[
                    styles.text,
                    {
                        fontSize: sizes[size].text,
                        opacity: textOpacity,
                        transform: [{ translateX: textTranslate }],
                    },
                ]}
            >
                Mosaic
            </Animated.Text>
        </View>
    );
});

export function MosaicLogo(props: MosaicLogoProps) {
    return <MosaicLogoComponent {...props} />;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontWeight: 'bold',
        color: '#6366F1',
        marginLeft: 8,
    },
});
