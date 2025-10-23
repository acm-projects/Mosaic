import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const tooltipStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    content: {
        position: 'absolute',
        zIndex: 50,
        backgroundColor: '#5C7AB8', // bg-primary
        color: '#FFFFFF', // text-primary-foreground
        borderRadius: 6, // rounded-md
        paddingHorizontal: 12, // px-3
        paddingVertical: 6, // py-1.5
        maxWidth: width * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontSize: 12, // text-xs
        color: '#FFFFFF',
        textAlign: 'center',
    },
    // The "arrow" is visually challenging in RN without SVG or specific libs, so we'll skip it for simplicity.
});

const TooltipContext = React.createContext({});

// TooltipProvider wraps the whole tree, setting delayDuration (mocked as longPress delay)
export function TooltipProvider({ delayDuration = 0, children, ...props }) {
    // In RN, delayDuration can be passed to onLongPress
    const contextValue = useMemo(() => ({ delayDuration }), [delayDuration]);
    return (
        <TooltipContext.Provider value={contextValue} {...props}>
            {children}
        </TooltipContext.Provider>
    );
}

// Tooltip is the controller
export function Tooltip({ open: openProp, onOpenChange, children, ...props }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [triggerLayout, setTriggerLayout] = useState(null);
    
    const open = openProp !== undefined ? openProp : internalOpen;
    const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;
    
    const rootContext = React.useContext(TooltipContext);

    const handleClose = () => {
        setOpen(false);
    };

    const contextValue = useMemo(() => ({
        ...rootContext,
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout,
        handleClose,
    }), [rootContext, open, setOpen, triggerLayout]);

    return (
        <TooltipContext.Provider value={contextValue}>
            {/* The trigger and content are handled separately */}
            {children}
            
            {/* Modal for content visibility */}
            <Modal transparent={true} visible={open} animationType="fade" onRequestClose={handleClose}>
                <TouchableOpacity style={tooltipStyles.overlay} onPress={handleClose} activeOpacity={1}>
                    {/* Content is passed through here, but rendered by its own function */}
                    {React.Children.map(children, child => 
                        React.isValidElement(child) && child.type === TooltipContent 
                            ? child
                            : null
                    )}
                </TouchableOpacity>
            </Modal>
        </TooltipContext.Provider>
    );
}

// TooltipTrigger handles the press/longPress logic
export function TooltipTrigger({ children, ...props }) {
    const { setOpen, setTriggerLayout, delayDuration } = React.useContext(TooltipContext);
    const triggerRef = useRef(null);

    const handleLongPress = useCallback(() => {
        triggerRef.current?.measureInWindow((x, y, w, h) => {
            setTriggerLayout({ x, y, width: w, height: h });
            setOpen(true);
        });
    }, [setOpen, setTriggerLayout]);
    
    // Use the first child and inject props
    return React.cloneElement(children, {
        ref: triggerRef,
        onLongPress: handleLongPress,
        delayLongPress: delayDuration,
        ...props
    });
}

// TooltipContent displays the actual tip
export function TooltipContent({ className, children, side = 'top', sideOffset = 4, ...props }) {
    const { open, triggerLayout } = React.useContext(TooltipContext);
    
    if (!open || !triggerLayout) return null;
    
    const contentStyle = StyleSheet.flatten(cn(tooltipStyles.content, className));
    
    // Simple positioning logic (e.g., top/center alignment)
    let top = triggerLayout.y;
    let left = triggerLayout.x + (triggerLayout.width / 2) - (contentStyle.maxWidth / 2);
    
    if (side === 'top') {
        top = triggerLayout.y - contentStyle.height - sideOffset; // Estimate height
    } else { // Default to bottom
        top = triggerLayout.y + triggerLayout.height + sideOffset;
    }
    
    // Simple horizontal constraint (needs to be calculated dynamically in a real app)
    if (left < 10) left = 10;
    if (left + contentStyle.maxWidth > width) left = width - contentStyle.maxWidth - 10;

    return (
        <View style={cn(tooltipStyles.content, { top, left }, className)} {...props}>
            <Text style={tooltipStyles.text}>{children}</Text>
        </View>
    );
}

// Mocking Radix exports
export const TooltipPortal = ({ children }) => children;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
