import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createVariants } from "./utils";

// --- Stylesheet for Badge Variants ---
const baseBadgeStyles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4, // rounded-md
        paddingHorizontal: 8, // px-2
        paddingVertical: 2, // py-0.5
        fontSize: 10, // text-xs
        fontWeight: '500', // font-medium
        alignSelf: 'flex-start', // w-fit
    },
    textBase: {
        fontSize: 12, // text-xs
        fontWeight: '500',
    }
});

const badgeVariants = createVariants(baseBadgeStyles.base, {
    variant: {
        default: { 
            backgroundColor: '#5C7AB8', 
            color: '#FFFFFF',
            borderWidth: 0,
        },
        secondary: {
            backgroundColor: '#2a2a4a',
            color: '#D1D5DB', // gray-300
            borderWidth: 0,
        },
        destructive: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            borderWidth: 0,
        },
        outline: {
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#ffffff1a',
        },
    },
});

export function Badge({ className, variant = "default", children, ...props }) {
    const style = badgeVariants({ variant, className });
    const textStyle = { color: style.color || baseBadgeStyles.textBase.color };

    return (
        <View
            style={[style]}
            {...props}
        >
            <Text style={[baseBadgeStyles.textBase, textStyle]}>
                {children}
            </Text>
        </View>
    );
}

export { badgeVariants };
