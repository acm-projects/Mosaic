import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width, height } = Dimensions.get('window');

const contextMenuStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    content: {
        position: 'absolute',
        zIndex: 50,
        minWidth: 160,
        backgroundColor: '#1a1a2e', // bg-popover
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 4,
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
        paddingVertical: 10,
        borderRadius: 4,
        outlineWidth: 0,
    },
    itemText: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: '#ffffff1a',
        marginVertical: 4,
        marginHorizontal: -4,
    },
    label: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    }
});

const ContextMenuContext = React.createContext({});

export function ContextMenu({ children, ...props }) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const contextValue = useMemo(() => ({
        open,
        setOpen,
        position,
        setPosition
    }), [open, position]);

    return (
        <ContextMenuContext.Provider value={contextValue}>
            {/* The modal is used to display the content over the app */}
            <Modal transparent={true} visible={open} animationType="fade">
                <View style={contextMenuStyles.overlay}>
                    {/* Dismiss by tapping overlay */}
                    <TouchableOpacity 
                        style={contextMenuStyles.overlay} 
                        onPress={() => setOpen(false)} 
                        activeOpacity={1}
                    />
                    {/* Render context menu content here */}
                    {children} 
                </View>
            </Modal>
        </ContextMenuContext.Provider>
    );
}

// Trigger is activated by a long press, sets position, and opens the modal
export function ContextMenuTrigger({ children, ...props }) {
    const { setOpen, setPosition } = React.useContext(ContextMenuContext);
    
    const handleLongPress = useCallback((event) => {
        // Use raw coordinates from the gesture event
        setPosition({ 
            x: event.nativeEvent.pageX, 
            y: event.nativeEvent.pageY 
        });
        setOpen(true);
    }, [setOpen, setPosition]);

    // We assume the child component can handle onLongPress (like a View or Button)
    return React.cloneElement(children, {
        onLongPress: handleLongPress,
        delayLongPress: 500, // standard long press delay
        ...props
    });
}

export function ContextMenuContent({ className, children, ...props }) {
    const { open, position } = React.useContext(ContextMenuContext);
    
    if (!open) return null;

    // Calculate position: ensure the menu stays within screen bounds
    const contentWidth = 160; // minWidth from styles
    const contentHeight = 250; // Estimated height

    const positionStyle = {
        top: Math.min(position.y, height - contentHeight - 10),
        left: Math.min(position.x, width - contentWidth - 10),
    };

    return (
        <View style={cn(contextMenuStyles.content, positionStyle, className)} {...props}>
            {children}
        </View>
    );
}

// Item (reused structure from DropdownMenu)
export function ContextMenuItem({ className, children, onPress, variant = "default", ...props }) {
    const isDestructive = variant === 'destructive';
    const textColor = isDestructive ? '#EF4444' : '#FFFFFF';
    
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.6}
            style={cn(contextMenuStyles.item, isDestructive && { backgroundColor: '#EF44441a' }, className)}
            {...props}
        >
            <Text style={[contextMenuStyles.itemText, { color: textColor }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

// Separator
export function ContextMenuSeparator({ className, ...props }) {
    return <View style={cn(contextMenuStyles.separator, className)} {...props} />;
}

// Label
export function ContextMenuLabel({ className, children, ...props }) {
    return (
        <Text style={cn(contextMenuStyles.label, className)} {...props}>
            {children}
        </Text>
    );
}

// Mocking all complex/Radix specific exports
export const ContextMenuCheckboxItem = ({ children }) => <ContextMenuItem>{children} [Checkbox]</ContextMenuItem>;
export const ContextMenuRadioItem = ({ children }) => <ContextMenuItem>{children} [Radio]</ContextMenuItem>;
export const ContextMenuSubTrigger = ({ children }) => <ContextMenuItem>{children} <Feather name="chevron-right" size={16} color="#FFFFFF" /></ContextMenuItem>;
export const ContextMenuSubContent = ({ children }) => <View>{children}</View>;
export const ContextMenuGroup = ({ children }) => <View>{children}</View>;
export const ContextMenuRadioGroup = ({ children }) => <View>{children}</View>;
export const ContextMenuSub = ({ children }) => <View>{children}</View>;
export const ContextMenuPortal = ({ children }) => children;
export const ContextMenuShortcut = ({ children }) => <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{children}</Text>;

export {
    ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator,
    ContextMenuShortcut, ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger, ContextMenuTrigger
};
