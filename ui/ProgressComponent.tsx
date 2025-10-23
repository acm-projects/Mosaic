import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { cn } from "./utils";

const progressStyles = StyleSheet.create({
    root: {
        backgroundColor: '#5C7AB833', // bg-primary/20
        position: 'relative',
        height: 8, // h-2
        width: '100%',
        overflow: 'hidden',
        borderRadius: 9999, // rounded-full
    },
    indicator: {
        backgroundColor: '#5C7AB8', // bg-primary
        height: '100%',
        // width handled by transform
    }
});

export function Progress({ className, value = 0, ...props }) {
    const animatedValue = useRef(new Animated.Value(value)).current;

    useEffect(() => {
        // Animate the value change
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [value, animatedValue]);

    // Calculate the translation based on the animated value
    const translateX = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['-100%', '0%'], // Starts off-screen left, moves to 0 offset
    });

    return (
        <View
            style={cn(progressStyles.root, className)}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityValue={{ now: value, min: 0, max: 100 }}
            {...props}
        >
            <Animated.View
                style={[
                    progressStyles.indicator,
                    {
                        transform: [{ translateX }],
                    }
                ]}
            />
        </View>
    );
}

export { Progress };
