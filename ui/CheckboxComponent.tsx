import { Feather } from '@expo/vector-icons';
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { cn } from "./utils";

const checkboxStyles = StyleSheet.create({
    root: {
        width: 16, // size-4
        height: 16,
        borderRadius: 4, // rounded-[4px]
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        transitionProperty: 'all',
    },
    unchecked: {
        backgroundColor: '#ffffff26', // bg-input-background (mocked)
        borderColor: '#ffffff1a', // border
    },
    checked: {
        backgroundColor: '#5C7AB8', // bg-primary
        borderColor: '#5C7AB8',
    },
    indicator: {
        width: 14, // size-3.5
        height: 14,
        color: '#FFFFFF', // text-primary-foreground
    }
});

export function Checkbox({ className, checked: externalChecked, onCheckedChange, disabled, ...props }) {
  // Use internal state if not controlled externally
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = externalChecked !== undefined ? externalChecked : internalChecked;

  const handlePress = () => {
    if (disabled) return;
    
    // Update external state if available, otherwise update internal state
    if (onCheckedChange) {
        onCheckedChange(!isChecked);
    } else {
        setInternalChecked(!isChecked);
    }
  };

  const style = cn(
    checkboxStyles.root,
    isChecked ? checkboxStyles.checked : checkboxStyles.unchecked,
    disabled && { opacity: 0.5 },
    className
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      style={style}
      {...props}
    >
      {isChecked && (
        <Feather 
          name="check" 
          size={14} 
          color={checkboxStyles.indicator.color} 
        />
      )}
    </TouchableOpacity>
  );
}