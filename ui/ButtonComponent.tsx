import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createVariants } from "./utils";

// --- Stylesheet for Button Variants ---
const baseButtonStyles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
        borderRadius: 8, // rounded-md
        transitionProperty: 'all',
        opacity: 1,
        // Disable state handled by TouchableOpacity props
    },
    textBase: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#FFFFFF',
    }
});

const buttonVariants = createVariants(baseButtonStyles.base, {
    variant: {
        default: { backgroundColor: '#5C7AB8', color: '#FFFFFF' },
        destructive: { backgroundColor: '#EF4444', color: '#FFFFFF' },
        outline: { 
            borderWidth: 1, 
            borderColor: '#ffffff1a', 
            backgroundColor: 'transparent',
            color: '#FFFFFF' 
        },
        secondary: { backgroundColor: '#2a2a4a', color: '#FFFFFF' },
        ghost: { backgroundColor: 'transparent', color: '#FFFFFF' },
        link: { backgroundColor: 'transparent', color: '#5C7AB8' },
    },
    size: {
        default: { height: 36, paddingHorizontal: 16, paddingVertical: 8 }, // h-9 px-4 py-2
        sm: { height: 32, borderRadius: 6, gap: 6, paddingHorizontal: 12 }, // h-8 rounded-md px-3
        lg: { height: 40, paddingHorizontal: 24, borderRadius: 10 }, // h-10 px-6
        icon: { height: 36, width: 36, padding: 0, borderRadius: 8 }, // size-9
    },
});

export const Button = React.forwardRef(({ 
    className, 
    variant = "default", 
    size = "default", 
    children, 
    onPress, 
    disabled,
    ...props 
}, ref) => {
    const style = buttonVariants({ variant, size, className });
    const textStyle = { color: style.color || baseButtonStyles.textBase.color };
    
    // For link variant, we add underline manually
    if (variant === 'link') {
        textStyle.textDecorationLine = 'underline';
    }

    return (
        <TouchableOpacity
            ref={ref}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
            style={[style, disabled && { opacity: 0.5 }]}
            {...props}
        >
            {/* Render children (icons) */}
            {children && <View>{children}</View>}
            
            {/* The title/label of the button is expected via props, not inner content for this conversion, but Radix uses children */}
            {/* Assuming primary text is passed as a child or a separate prop */}
            {typeof children === 'string' ? (
                <Text style={[baseButtonStyles.textBase, textStyle]}>{children}</Text>
            ) : (
                // If children are complex (e.g., just an icon), this might be a placeholder.
                // We assume primary text content will be passed via 'title' or is mixed in children.
                null
            )}
            
        </TouchableOpacity>
    );
});

// Since the existing project uses Button via an external implementation, 
// we will reuse the simplified component structure from `src/components/UI.jsx`
// which already exists, but provide the utility for others.

export { buttonVariants };
