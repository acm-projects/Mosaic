import React from "react";
import { StyleSheet, View } from "react-native";
import { cn } from "./utils";

const separatorStyles = StyleSheet.create({
    horizontal: {
        backgroundColor: '#ffffff1a', // bg-border
        height: 1, // h-px
        width: '100%', // w-full
        flexShrink: 0,
    },
    vertical: {
        backgroundColor: '#ffffff1a', // bg-border
        width: 1, // w-px
        height: '100%', // h-full
        flexShrink: 0,
    }
});

export function Separator({ className, orientation = "horizontal", ...props }) {
    const style = orientation === 'horizontal' ? separatorStyles.horizontal : separatorStyles.vertical;

    return (
        <View
            style={cn(style, className)}
            // ARIA roles are mocked by accessibilityRole
            accessibilityRole="separator"
            {...props}
        />
    );
}

export { Separator };
