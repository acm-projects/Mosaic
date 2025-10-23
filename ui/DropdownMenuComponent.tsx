import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { height, width } = Dimensions.get('window');

const dropdownStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent', // Transparent overlay for dismissing
    },
    content: {
        position: 'absolute', // Absolute positioning near the trigger
        zIndex: 50,
        minWidth: 160, // min-w-[8rem]
        backgroundColor: '#1a1a2e', // bg-popover (mocked card bg)
        borderRadius: 6, // rounded-md
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 4, // p-1
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
        paddingVertical: 10, // py-1.5
        borderRadius: 4,
        outlineWidth: 0,
    },
    itemText: {
        fontSize: 14,
        color: '#FFFFFF', // text-popover-foreground
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: '#ffffff1a', // bg-border
        marginVertical: 4, // my-1
        marginHorizontal: -4, // -mx-1
    },
    label: {
        paddingHorizontal: 8,
        paddingVertical: 6, // py-1.5
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    }
});

// Context to manage visibility and position
const DropdownMenuContext = React.createContext({});

export function DropdownMenu({ open, onOpenChange, children, ...props }) {
    const [triggerLayout, setTriggerLayout] = useState(null);

    const contextValue = useMemo(() => ({
        open,
        onOpenChange,
        triggerLayout,
        setTriggerLayout
    }), [open, onOpenChange, triggerLayout]);

    return (
        <DropdownMenuContext.Provider value={contextValue}>
            {/* The modal is used to display the content over the app */}
            <Modal transparent={true} visible={open} animationType="fade">
                <View style={dropdownStyles.overlay}>
                    {/* Dismiss by tapping overlay */}
                    <TouchableOpacity 
                        style={dropdownStyles.overlay} 
                        onPress={() => onOpenChange(false)} 
                        activeOpacity={1}
                    />
                    {children}
                </View>
            </Modal>
        </DropdownMenuContext.Provider>
    );
}

// Trigger needs to measure its position
export function DropdownMenuTrigger({ children, ...props }) {
    const { onOpenChange, setTriggerLayout, open } = React.useContext(DropdownMenuContext);
    const triggerRef = React.useRef(null);
    
    const handlePress = useCallback(() => {
        triggerRef.current?.measureInWindow((x, y, w, h) => {
            setTriggerLayout({ x, y, width: w, height: h });
            onOpenChange(!open);
        });
    }, [onOpenChange, open, setTriggerLayout]);

    return React.cloneElement(children, {
        ref: triggerRef,
        onPress: handlePress,
        ...props
    });
}

// Content needs to position itself relative to the trigger
export function DropdownMenuContent({ className, children, ...props }) {
    const { open, triggerLayout } = React.useContext(DropdownMenuContext);
    
    if (!open || !triggerLayout) return null;

    // Calculate position (simple mock: top-right alignment)
    const positionStyle = {
        top: triggerLayout.y + triggerLayout.height + 4,
        right: width - triggerLayout.x - triggerLayout.width,
    };

    return (
        <View style={cn(dropdownStyles.content, positionStyle, className)} {...props}>
            {children}
        </View>
    );
}

// Item (similar to ContextMenuItem)
export function DropdownMenuItem({ className, children, onPress, variant = "default", ...props }) {
    const isDestructive = variant === 'destructive';
    const textColor = isDestructive ? '#EF4444' : '#FFFFFF';
    
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.6}
            style={cn(dropdownStyles.item, isDestructive && { backgroundColor: '#EF44441a' }, className)}
            {...props}
        >
            <Text style={[dropdownStyles.itemText, { color: textColor }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

// Separator
export function DropdownMenuSeparator({ className, ...props }) {
    return <View style={cn(dropdownStyles.separator, className)} {...props} />;
}

// Label
export function DropdownMenuLabel({ className, children, ...props }) {
    return (
        <Text style={cn(dropdownStyles.label, className)} {...props}>
            {children}
        </Text>
    );
}

// Mocking Checkbox, Radio, Sub, Shortcut, Group, Portal, Close (due to complexity)
export const DropdownMenuCheckboxItem = ({ children }) => <DropdownMenuItem>{children} [Checkbox]</DropdownMenuItem>;
export const DropdownMenuRadioItem = ({ children }) => <DropdownMenuItem>{children} [Radio]</DropdownMenuItem>;
export const DropdownMenuSubTrigger = ({ children }) => <DropdownMenuItem>{children} <Feather name="chevron-right" size={16} color="#FFFFFF" /></DropdownMenuItem>;
export const DropdownMenuSubContent = ({ children }) => <View>{children}</View>;
export const DropdownMenuGroup = ({ children }) => <View>{children}</View>;
export const DropdownMenuRadioGroup = ({ children }) => <View>{children}</View>;
export const DropdownMenuSub = ({ children }) => <View>{children}</View>;
export const DropdownMenuPortal = ({ children }) => children;
export const DropdownMenuClose = ({ children }) => children;
export const DropdownMenuShortcut = ({ children }) => <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{children}</Text>;


export {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
};
