import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { cn } from "./utils";

const inputStyles = StyleSheet.create({
    root: {
        // Shared base styles from existing components
        height: 48, // h-9 base, using 48px from existing screens (CreateAccountScreen)
        width: '100%',
        minWidth: 0,
        borderRadius: 8, // rounded-md
        borderWidth: 1,
        paddingHorizontal: 12, // px-3
        paddingVertical: 8, // py-1
        fontSize: 16, // text-base
        
        // Theme colors
        color: '#FFFFFF', // text-foreground
        backgroundColor: '#1a1a2e', // bg-input-background (mocked card bg)
        borderColor: '#ffffff1a', // border-input (mocked border)
    },
    placeholder: {
        color: '#9CA3AF', // placeholder:text-muted-foreground
    },
    // Error state style (used in combination with Form component)
    error: {
        borderColor: '#EF4444',
        borderWidth: 2,
    }
});

export const Input = React.forwardRef(({ className, style, type, ...props }, ref) => {
    // Determine keyboard type based on web 'type'
    let keyboardType = 'default';
    if (type === 'email' || type === 'email-address') {
        keyboardType = 'email-address';
    } else if (type === 'number') {
        keyboardType = 'numeric';
    }

    return (
        <TextInput
            ref={ref}
            style={cn(inputStyles.root, className, style)}
            placeholderTextColor={inputStyles.placeholder.color}
            secureTextEntry={type === 'password'}
            keyboardType={keyboardType}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            // Disabled state handled by TextInput prop
            editable={!props.disabled} 
            {...props}
        />
    );
});

export { Input };
