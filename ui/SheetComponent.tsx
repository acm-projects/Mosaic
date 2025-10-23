import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width, height } = Dimensions.get('window');
const SHEET_WIDTH = width * 0.75; // w-3/4
const SHEET_HEIGHT_AUTO = height * 0.5; // h-auto mock

const sheetStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)', // fixed inset-0 z-50 bg-black/50
    },
    // Base style for the sliding panel
    contentBase: {
        position: 'absolute',
        backgroundColor: '#1a1a2e', // bg-background (mocked)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        gap: 16, // gap-4
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#ffffff1a',
        zIndex: 50,
    },
    // Side specific styles (initial dimensions)
    right: { height: '100%', width: SHEET_WIDTH, right: 0, top: 0, borderLeftWidth: 1 },
    left: { height: '100%', width: SHEET_WIDTH, left: 0, top: 0, borderRightWidth: 1 },
    top: { width: '100%', height: SHEET_HEIGHT_AUTO, top: 0, borderBottomWidth: 1 },
    bottom: { width: '100%', height: SHEET_HEIGHT_AUTO, bottom: 0, borderTopWidth: 1 },
    
    // Header/Footer/Title/Description
    header: {
        flexDirection: 'column',
        gap: 6, // gap-1.5
        padding: 16, // p-4
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'column',
        gap: 8, // gap-2
        padding: 16, // p-4
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    description: {
        fontSize: 14,
        color: '#9CA3AF', // text-muted-foreground
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
        zIndex: 10,
    },
});

const SheetContext = React.createContext({});

export function Sheet({ open, onOpenChange, children, ...props }) {
    const contextValue = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);

    return (
        <SheetContext.Provider value={contextValue}>
            <Modal
                transparent={true}
                visible={open}
                onRequestClose={() => onOpenChange && onOpenChange(false)}
                animationType="none" // Controlled by Animated.View below
                {...props}
            >
                {/* Overlay handles dismissal when tapping outside */}
                <SheetOverlay>
                    <SheetContent>
                        {children}
                    </SheetContent>
                </SheetOverlay>
            </Modal>
        </SheetContext.Provider>
    );
}

export function SheetOverlay({ className, children, ...props }) {
    const { onOpenChange } = React.useContext(SheetContext);
    
    // Touchable wrapper to close sheet on background press
    return (
        <TouchableOpacity 
            style={cn(sheetStyles.overlay, className)} 
            onPress={() => onOpenChange && onOpenChange(false)}
            activeOpacity={1}
            {...props}
        >
            {children}
        </TouchableOpacity>
    );
}

export function SheetContent({ className, children, side = "right", ...props }) {
    const { open, onOpenChange } = React.useContext(SheetContext);
    const animValue = useRef(new Animated.Value(0)).current;
    
    // Determine the translation direction and initial/final positions
    const translateMap = {
        right: { initial: width, final: 0, prop: 'translateX' },
        left: { initial: -SHEET_WIDTH, final: 0, prop: 'translateX' },
        bottom: { initial: SHEET_HEIGHT_AUTO, final: 0, prop: 'translateY' },
        top: { initial: -SHEET_HEIGHT_AUTO, final: 0, prop: 'translateY' },
    };
    const { initial, final, prop } = translateMap[side];
    const sideStyle = sheetStyles[side];
    
    // Animate the sheet in/out
    useEffect(() => {
        const toValue = open ? 1 : 0;
        Animated.timing(animValue, {
            toValue: toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [open, animValue]);

    const translate = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [initial, final],
    });
    
    const animatedStyle = {
        transform: [{ [prop]: translate }],
    };

    // Stop propagation so touching the sheet doesn't close the modal
    const handleSheetPress = (e) => { e.stopPropagation(); };

    return (
        <Animated.View
            // Use pointerEvents="box-none" on the content wrapper to allow the TouchableOpacity overlay
            // to register the press, and use the inner View for the actual sheet press.
            style={cn(sheetStyles.contentBase, sideStyle, animatedStyle, className)}
            onTouchStart={handleSheetPress}
            {...props}
        >
            {children}
            
            <TouchableOpacity 
                onPress={() => onOpenChange && onOpenChange(false)}
                style={sheetStyles.closeButton}
            >
                <Feather name="x" size={16} color="#FFFFFF" />
                {/* sr-only span omitted */}
            </TouchableOpacity>
        </Animated.View>
    );
}

// Simple wrapper components for Sheet Header/Footer/Title/Description
export function SheetHeader({ className, children, ...props }) {
  return <View style={cn(sheetStyles.header, className)} {...props}>{children}</View>;
}

export function SheetFooter({ className, children, ...props }) {
  return <View style={cn(sheetStyles.footer, className)} {...props}>{children}</View>;
}

export function SheetTitle({ className, children, ...props }) {
  return <Text style={cn(sheetStyles.title, className)} {...props}>{children}</Text>;
}

export function SheetDescription({ className, children, ...props }) {
  return <Text style={cn(sheetStyles.description, className)} {...props}>{children}</Text>;
}

// Mocking Radix-specific components/exports
export const SheetTrigger = ({ children }) => children;
export const SheetClose = ({ children }) => children;
export const SheetPortal = ({ children }) => children;

export {
    Sheet, SheetClose,
    SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger
};
