import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Modal, PanResponder, StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";

const { height } = Dimensions.get('window');
const SNAP_POINT = height * 0.8; // Max 80vh height
const CLOSE_THRESHOLD = 50;

const drawerStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a2e', // bg-background
        maxHeight: SNAP_POINT,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 1,
        borderColor: '#ffffff1a',
        overflow: 'hidden',
    },
    handle: {
        alignSelf: 'center',
        marginTop: 16, // mt-4
        marginBottom: 8,
        height: 4, // h-1.5
        width: 80, // w-[100px]
        backgroundColor: '#9CA3AF', // bg-muted
        borderRadius: 2,
    },
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
    }
});

const DrawerContext = React.createContext({});

export function Drawer({ open, onOpenChange, children, ...props }) {
    const [contentHeight, setContentHeight] = useState(0);
    const translateY = useRef(new Animated.Value(height)).current;
    
    // Use an effect to handle the open/close animation
    React.useEffect(() => {
        if (open) {
            // Animate in from bottom (to initial position)
            Animated.timing(translateY, {
                toValue: height - contentHeight, // Slide to top edge of content
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start();
        } else {
            // Animate out to bottom
            Animated.timing(translateY, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }).start();
        }
    }, [open, contentHeight]);

    const handleLayout = useCallback((event) => {
        const measuredHeight = event.nativeEvent.layout.height;
        if (measuredHeight > 0 && measuredHeight !== contentHeight) {
            setContentHeight(measuredHeight);
            if (open) {
                 // Adjust position immediately after measuring if already open
                 translateY.setValue(height - measuredHeight);
            }
        }
    }, [open, contentHeight]);

    // PanResponder for drag-to-close gesture
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                // Allow drag down only
                if (gestureState.dy > 0) {
                    translateY.setValue(height - contentHeight + gestureState.dy);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > CLOSE_THRESHOLD) {
                    onOpenChange(false);
                } else {
                    // Snap back to open position
                    Animated.timing(translateY, {
                        toValue: height - contentHeight,
                        duration: 150,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const contextValue = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);

    return (
        <DrawerContext.Provider value={contextValue}>
            <Modal transparent={true} visible={open} onRequestClose={() => onOpenChange(false)} {...props}>
                <DrawerOverlay />
                <DrawerContent 
                    translateY={translateY} 
                    panHandlers={panResponder.panHandlers} 
                    onLayout={handleLayout}
                >
                    {children}
                </DrawerContent>
            </Modal>
        </DrawerContext.Provider>
    );
}

export function DrawerOverlay({ className, ...props }) {
    const { open } = React.useContext(DrawerContext);
    
    return <View style={cn(drawerStyles.overlay, className)} {...props} />;
}

export function DrawerContent({ className, children, translateY, panHandlers, onLayout, ...props }) {
    return (
        <Animated.View
            style={[drawerStyles.contentContainer, { transform: [{ translateY }] }, className]}
            onLayout={onLayout}
            {...panHandlers}
            {...props}
        >
            <View style={drawerStyles.handle} {...panHandlers} />
            {children}
        </Animated.View>
    );
}

// Simple wrapper components (Header, Footer, Title, Description)
export function DrawerHeader({ className, children, ...props }) {
  return <View style={cn(drawerStyles.header, className)} {...props}>{children}</View>;
}

export function DrawerFooter({ className, children, ...props }) {
  return <View style={cn(drawerStyles.footer, className)} {...props}>{children}</View>;
}

export function DrawerTitle({ className, children, ...props }) {
  return <Text style={cn(drawerStyles.title, className)} {...props}>{children}</Text>;
}

export function DrawerDescription({ className, children, ...props }) {
  return <Text style={cn(drawerStyles.description, className)} {...props}>{children}</Text>;
}

// Mocking Vaul-specific components/exports not used in RN directly
export const DrawerTrigger = ({ children }) => children;
export const DrawerClose = ({ children }) => children;
export const DrawerPortal = ({ children }) => children;

export {
    Drawer, DrawerClose,
    DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger
};
