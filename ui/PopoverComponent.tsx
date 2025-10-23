import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const popoverStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    content: {
        position: 'absolute',
        zIndex: 50,
        width: 288, // w-72 (tailwind default: 18rem = 288px)
        backgroundColor: '#1a1a2e', // bg-popover (mocked card bg)
        borderRadius: 8, // rounded-md
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 16, // p-4
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
});

const PopoverContext = React.createContext({});

export function Popover({ open, onOpenChange, children, ...props }) {
    const [triggerLayout, setTriggerLayout] = useState(null);

    const contextValue = useMemo(() => ({
        open,
        onOpenChange,
        triggerLayout,
        setTriggerLayout
    }), [open, onOpenChange, triggerLayout]);

    return (
        <PopoverContext.Provider value={contextValue}>
            {/* The modal is used to display the content over the app */}
            <Modal transparent={true} visible={open} animationType="fade" {...props}>
                <View style={popoverStyles.overlay}>
                    {/* Dismiss by tapping overlay */}
                    <TouchableOpacity 
                        style={popoverStyles.overlay} 
                        onPress={() => onOpenChange(false)} 
                        activeOpacity={1}
                    />
                    {children}
                </View>
            </Modal>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger({ children, ...props }) {
    const { onOpenChange, setTriggerLayout, open } = React.useContext(PopoverContext);
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

export function PopoverContent({ className, children, align = "center", sideOffset = 4, ...props }) {
    const { open, triggerLayout } = React.useContext(PopoverContext);
    
    if (!open || !triggerLayout) return null;

    // --- Simple Positioning Logic (Mocking Radix) ---
    const positionStyle = {
        // Default (Center aligned, bottom sideOffset=4)
        top: triggerLayout.y + triggerLayout.height + sideOffset,
        left: triggerLayout.x + (triggerLayout.width / 2) - (popoverStyles.content.width / 2),
    };
    
    // Ensure it doesn't go off screen right
    if (positionStyle.left + popoverStyles.content.width > width) {
        positionStyle.left = width - popoverStyles.content.width - 10;
    }
    // Ensure it doesn't go off screen left
    if (positionStyle.left < 10) {
        positionStyle.left = 10;
    }

    // Anchor mock is handled implicitly by measuring the trigger and calculating position
    
    return (
        <View style={cn(popoverStyles.content, positionStyle, className)} {...props}>
            {children}
        </View>
    );
}

// Mocking Radix-specific components/exports not used in RN directly
export const PopoverAnchor = ({ children }) => children;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
