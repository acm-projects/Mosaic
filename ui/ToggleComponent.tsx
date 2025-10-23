import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { cn } from "./utils";

const toggleStyles = StyleSheet.create({
    // --- Base Styles (Default Size) ---
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
        borderRadius: 8, // rounded-md
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        paddingHorizontal: 8, // px-2
        minWidth: 36, // min-w-9
        height: 36, // h-9
        
        // Default variant (bg-transparent)
        backgroundColor: 'transparent',
        color: '#FFFFFF',
    },
    // --- Variant Styles ---
    outline: {
        borderWidth: 1,
        borderColor: '#ffffff1a', // border-input
    },
    // --- State Styles ---
    hover: { // Hover is mocked by reduced opacity
        opacity: 0.8, 
    },
    active: { // data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
        backgroundColor: '#5C7AB830', 
        borderColor: '#5C7AB8',
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.5,
    },
    // --- Size Overrides ---
    sm: {
        height: 32, // h-8
        minWidth: 32, // min-w-8
        paddingHorizontal: 6, // px-1.5
    },
    lg: {
        height: 40, // h-10
        minWidth: 40, // min-w-10
        paddingHorizontal: 10, // px-2.5
    },
    // Text style (apply separately)
    textBase: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    }
});

// Helper function to apply size styles
const getSizeStyle = (size) => {
    switch (size) {
        case 'sm': return toggleStyles.sm;
        case 'lg': return toggleStyles.lg;
        default: return {};
    }
};

export const Toggle = React.forwardRef(({ 
    className, 
    variant = 'default', 
    size = 'default', 
    pressed, 
    onPress, 
    disabled, 
    children, 
    ...props 
}, ref) => {

    const handlePress = () => {
        if (!disabled && onPress) {
            // onPress should handle the state update (toggle)
            onPress();
        }
    };
    
    // Combine base, variant, size, and state styles
    const combinedStyle = cn(
        toggleStyles.base,
        variant === 'outline' && toggleStyles.outline,
        getSizeStyle(size),
        pressed && toggleStyles.active,
        disabled && toggleStyles.disabled,
        className
    );
    
    // Check if children contain a string for standalone button text
    const textChild = React.Children.toArray(children).find(
        child => typeof child === 'string' || (React.isValidElement(child) && child.type === Text)
    );

    return (
        <TouchableOpacity
            ref={ref}
            onPress={handlePress}
            activeOpacity={disabled || pressed ? 1.0 : 0.7}
            disabled={disabled}
            style={combinedStyle}
            accessibilityRole="button"
            accessibilityState={{ selected: pressed }}
            {...props}
        >
            {React.Children.map(children, child => {
                // If it's a string, wrap it in Text with base styles
                if (typeof child === 'string') {
                    return <Text style={toggleStyles.textBase}>{child}</Text>;
                }
                // If it's a valid element, return it (e.g., an icon)
                return child;
            })}
        </TouchableOpacity>
    );
});

// Export toggleVariants mock for ToggleGroup
export const toggleVariants = ({ variant, size }) => {
    const base = toggleStyles.base;
    const variantStyle = variant === 'outline' ? toggleStyles.outline : {};
    const sizeStyle = getSizeStyle(size);
    return cn(base, variantStyle, sizeStyle);
};

export { Toggle };
