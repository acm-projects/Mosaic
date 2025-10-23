import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const hoverCardStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    content: {
        position: 'absolute',
        zIndex: 50,
        width: 256, // w-64
        backgroundColor: '#1a1a2e', // bg-popover
        borderRadius: 8,
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

const HoverCardContext = React.createContext({});

export function HoverCard({ open, onOpenChange, children, ...props }) {
    const [triggerLayout, setTriggerLayout] = useState(null);

    const contextValue = useMemo(() => ({
        open,
        onOpenChange,
        triggerLayout,
        setTriggerLayout
    }), [open, onOpenChange, triggerLayout]);

    return (
        <HoverCardContext.Provider value={contextValue}>
            {/* Modal for content visibility */}
            <Modal transparent={true} visible={open} animationType="fade" {...props}>
                <View style={hoverCardStyles.overlay}>
                    {/* Dimiss by tapping overlay */}
                    <TouchableOpacity 
                        style={hoverCardStyles.overlay} 
                        onPress={() => onOpenChange(false)} 
                        activeOpacity={1}
                    />
                    {children}
                </View>
            </Modal>
        </HoverCardContext.Provider>
    );
}

export function HoverCardTrigger({ children, ...props }) {
    const { onOpenChange, setTriggerLayout, open } = React.useContext(HoverCardContext);
    const triggerRef = React.useRef(null);
    
    // Simulate hover/focus by using a long press for mobile interaction
    const handleLongPress = useCallback(() => {
        if (!open) {
            triggerRef.current?.measureInWindow((x, y, w, h) => {
                setTriggerLayout({ x, y, width: w, height: h });
                onOpenChange(true);
            });
        }
    }, [onOpenChange, open, setTriggerLayout]);
    
    // Use regular onPress to close immediately if open
    const handlePress = useCallback(() => {
        if (open) {
            onOpenChange(false);
        }
    }, [open, onOpenChange]);

    return React.cloneElement(children, {
        ref: triggerRef,
        onLongPress: handleLongPress,
        onPress: handlePress,
        delayLongPress: 500, // Standard long press delay
        ...props
    });
}

export function HoverCardContent({ className, children, align = "center", sideOffset = 4, ...props }) {
    const { open, triggerLayout } = React.useContext(HoverCardContext);
    
    if (!open || !triggerLayout) return null;

    // Simple Positioning Logic (Default bottom-center)
    const positionStyle = {
        top: triggerLayout.y + triggerLayout.height + sideOffset,
        left: triggerLayout.x + (triggerLayout.width / 2) - (hoverCardStyles.content.width / 2),
    };
    
    // Basic screen edge check
    if (positionStyle.left + hoverCardStyles.content.width > width) {
        positionStyle.left = width - hoverCardStyles.content.width - 10;
    }
    if (positionStyle.left < 10) {
        positionStyle.left = 10;
    }

    return (
        <View style={cn(hoverCardStyles.content, positionStyle, className)} {...props}>
            {children}
        </View>
    );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
