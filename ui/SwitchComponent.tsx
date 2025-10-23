import React from "react";
import { Switch as RNSwitch, StyleSheet } from "react-native";
import { cn } from "./utils";

const switchStyles = StyleSheet.create({
    // Colors based on existing theme: Primary is #5C7AB8 (data-[state=checked]:bg-primary)
    // Background is usually a dark gray/black (data-[state=unchecked]:bg-switch-background)
    trackColorFalse: '#33334d', // Dark gray for unchecked state
    trackColorTrue: '#5C7AB8',
    thumbColor: '#FFFFFF', // White thumb (bg-card / dark:bg-primary-foreground)
    
    container: {
        // inline-flex h-[1.15rem] w-8 
        height: 24, // 1.15rem is approx 18.4, using 24 for better touch target
        width: 44, // w-8 is approx 32, using 44 for RN standard size
        borderRadius: 9999, // rounded-full
    }
});

export const Switch = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    // RN Switch automatically handles disabled and styling via props, 
    // replacing the need for complex Radix primitives and data attributes.
    return (
        <RNSwitch
            ref={ref}
            value={checked}
            onValueChange={onCheckedChange}
            disabled={disabled}
            trackColor={{ false: switchStyles.trackColorFalse, true: switchStyles.trackColorTrue }}
            thumbColor={switchStyles.thumbColor}
            ios_backgroundColor={switchStyles.trackColorFalse}
            style={cn(switchStyles.container, className)}
            {...props}
        />
    );
});

export { Switch };
