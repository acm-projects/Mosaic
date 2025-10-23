import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const radioStyles = StyleSheet.create({
    root: {
        gap: 12, // grid gap-3
    },
    itemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    item: {
        width: 16, // size-4
        height: 16,
        borderRadius: 9999, // rounded-full
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e', // dark:bg-input/30
        borderColor: '#ffffff1a', // border-input
        overflow: 'hidden',
    },
    indicator: {
        width: 8, // size-2
        height: 8,
        borderRadius: 9999,
        backgroundColor: '#5C7AB8', // fill-primary
    },
    itemChecked: {
        borderColor: '#5C7AB8',
        borderWidth: 2,
    },
});

const RadioGroupContext = React.createContext({});

export function RadioGroup({ className, value, onValueChange, children, ...props }) {
    // If external control is not provided, manage internal state
    const [internalValue, setInternalValue] = useState(props.defaultValue || null);
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = useCallback((newValue) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    }, [onValueChange]);

    const contextValue = useMemo(() => ({ value: currentValue, onValueChange: handleValueChange }), [currentValue, handleValueChange]);

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <View style={cn(radioStyles.root, className)} {...props}>
                {children}
            </View>
        </RadioGroupContext.Provider>
    );
}

export function RadioGroupItem({ className, value, children, disabled, ...props }) {
    const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext);
    const isChecked = selectedValue === value;

    const handlePress = () => {
        if (!disabled && onValueChange) {
            onValueChange(value);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={disabled}
            style={cn(radioStyles.itemWrapper, disabled && { opacity: 0.5 })}
            {...props}
        >
            <View
                style={cn(
                    radioStyles.item,
                    isChecked && radioStyles.itemChecked,
                    className
                )}
            >
                {isChecked && (
                    <View style={radioStyles.indicator} />
                )}
            </View>
            {/* Render any accompanying label/text */}
            {children}
        </TouchableOpacity>
    );
}

export { RadioGroup, RadioGroupItem };
