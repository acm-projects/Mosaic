import React from "react";
import { View } from "react-native";

// --- AspectRatio Component (Originally aspect-ratio.tsx) ---
// Note: Radix usage is replaced by a simple RN View wrapper that applies
// the aspectRatio style property.

export function AspectRatio({ ratio, style, children, ...props }) {
    // ratio prop is the only non-standard prop needed, e.g., ratio={16/9}
    return (
        <View
            style={[{ aspectRatio: ratio || 1 }, style]}
            {...props}
        >
            {children}
        </View>
    );
}