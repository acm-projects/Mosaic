import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const selectStyles = StyleSheet.create({
    root: {
        width: '100%',
    },
    trigger: {
        height: 36, // data-[size=default]:h-9
        width: '100%',
        borderRadius: 8, // rounded-md
        borderWidth: 1,
        paddingHorizontal: 12, // px-3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a2e', // dark:bg-input/30
        borderColor: '#ffffff1a', // border-input
    },
    value: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    icon: {
        marginLeft: 8,
        opacity: 0.5,
    },
    contentOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end', // Pop up from bottom
    },
    content: {
        maxHeight: '50%',
        minWidth: 128, // min-w-[8rem]
        backgroundColor: '#1a1a2e', // bg-popover
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 8, // p-1
        overflow: 'hidden',
    },
    item: {
        paddingHorizontal: 8,
        paddingVertical: 10, // py-1.5
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemActive: {
        backgroundColor: '#5C7AB830', // focus:bg-accent
    },
    itemText: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    label: {
        paddingHorizontal: 8,
        paddingVertical: 6, // py-1.5
        fontSize: 12, // text-xs
        color: '#9CA3AF', // text-muted-foreground
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#ffffff1a',
        marginVertical: 4, // my-1
        marginHorizontal: -8, // -mx-1
    }
});

const SelectContext = React.createContext({});

export function Select({ value, onValueChange, children, ...props }) {
    const [open, setOpen] = useState(false);
    
    const contextValue = useMemo(() => ({ value, onValueChange, setOpen }), [value, onValueChange, setOpen]);

    return (
        <SelectContext.Provider value={contextValue}>
            <View style={selectStyles.root} {...props}>
                {children}
            </View>
            <Modal
                transparent={true}
                visible={open}
                onRequestClose={() => setOpen(false)}
                animationType="slide"
            >
                {/* Find and render content inside the modal */}
                {React.Children.map(children, child => 
                    React.isValidElement(child) && child.type === SelectContent 
                        ? child 
                        : null
                )}
                {/* Touchable area outside content closes modal */}
                <TouchableOpacity style={selectStyles.contentOverlay} onPress={() => setOpen(false)} activeOpacity={1}/>
            </Modal>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ className, size = "default", children, ...props }) {
    const { value, setOpen } = React.useContext(SelectContext);
    
    // Find the displayed value if a SelectValue is not passed directly
    let displayedValue = 'Select option...'; 
    if (value) {
        // This is a simple mock of SelectValue based on the actual value prop
        displayedValue = value; 
    }

    const handlePress = () => setOpen(true);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={cn(selectStyles.trigger, className)}
            {...props}
        >
            <Text style={selectStyles.value}>{displayedValue}</Text>
            <Feather name="chevron-down" size={16} color="#FFFFFF" style={selectStyles.icon} />
        </TouchableOpacity>
    );
}

export function SelectContent({ className, children, ...props }) {
    const { setOpen } = React.useContext(SelectContext);
    
    const handleItemSelect = (itemValue) => {
        // This logic is implemented in SelectItem, but needs to be here for the modal.
        // For simplicity, we assume SelectItem's onPress handles context update and close.
    };

    return (
        <View style={selectStyles.contentOverlay}>
            <View style={cn(selectStyles.content, className)} {...props}>
                <ScrollView>
                    {/* Items */}
                    {React.Children.map(children, child => 
                        React.isValidElement(child) ? React.cloneElement(child, { setOpen }) : child
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

export function SelectItem({ className, children, value, setOpen, ...props }) {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
    const isSelected = selectedValue === value;
    
    const handlePress = () => {
        onValueChange(value);
        setOpen(false);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={cn(selectStyles.item, isSelected && selectStyles.itemActive, className)}
            {...props}
        >
            <Text style={selectStyles.itemText}>{children}</Text>
            {isSelected && (
                <Feather name="check" size={16} color="#FFFFFF" />
            )}
        </TouchableOpacity>
    );
}

// Simple wrapper components / mocks
export function SelectLabel({ className, children, ...props }) {
  return <Text style={cn(selectStyles.label, className)} {...props}>{children}</Text>;
}
export function SelectSeparator({ className, ...props }) {
  return <View style={cn(selectStyles.separator, className)} {...props} />;
}
export const SelectValue = ({ children }) => children;
export const SelectGroup = ({ children }) => <View>{children}</View>;
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;


export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue
};
