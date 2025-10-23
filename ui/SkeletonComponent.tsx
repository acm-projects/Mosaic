import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { cn } from "./utils";

const skeletonStyles = StyleSheet.create({
    root: {
        backgroundColor: '#5C7AB850', // bg-accent (mocked with opacity)
        borderRadius: 8, // rounded-md
    },
    // Styles for the pulsing animation
    pulse: {
        opacity: 0.5,
    }
});

export function Skeleton({ className, ...props }) {
    const pulseAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Create an infinite pulsing animation loop
        const startAnimation = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(startAnimation); // Loop the sequence
        };

        startAnimation();
        
        // Cleanup on unmount
        return () => pulseAnim.stop(); 
    }, [pulseAnim]);
    
    // Apply animation to opacity
    const animatedStyle = {
        opacity: pulseAnim,
    };

    return (
        <Animated.View
            style={cn(skeletonStyles.root, animatedStyle, className)}
            {...props}
        />
    );
}

export { Skeleton };
