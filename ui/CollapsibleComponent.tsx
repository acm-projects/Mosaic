import React, { useCallback, useMemo, useState } from "react";
import { LayoutAnimation, Platform, TouchableOpacity, UIManager, View } from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CollapsibleContext = React.createContext({});

// --- Collapsible Component (Originally collapsible.tsx) ---
export function Collapsible({ open, onOpenChange, children, defaultOpen, ...props }) {
    // Manage internal state if uncontrolled
    const [internalOpen, setInternalOpen] = useState(defaultOpen || false);
    const isOpen = open !== undefined ? open : internalOpen;

    const handleToggle = useCallback(() => {
        // Use RN's LayoutAnimation for smooth opening/closing
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (onOpenChange) {
            onOpenChange(!isOpen);
        } else {
            setInternalOpen(!isOpen);
        }
    }, [isOpen, onOpenChange]);

    const contextValue = useMemo(() => ({ isOpen, handleToggle }), [isOpen, handleToggle]);

    return (
        <CollapsibleContext.Provider value={contextValue}>
            <View {...props}>
                {children}
            </View>
        </CollapsibleContext.Provider>
    );
}

export function CollapsibleTrigger({ children, ...props }) {
    const { handleToggle } = React.useContext(CollapsibleContext);

    // Assuming children is a single TouchableOpacity or can wrap its press functionality
    if (React.isValidElement(children)) {
        return React.cloneElement(children, { onPress: handleToggle, ...props });
    }
    
    // Fallback to a basic TouchableOpacity if the child is not a valid element
    return <TouchableOpacity onPress={handleToggle} activeOpacity={0.7} {...props}>{children}</TouchableOpacity>;
}

export function CollapsibleContent({ children, ...props }) {
    const { isOpen } = React.useContext(CollapsibleContext);
    
    // Only render the children if open, relying on LayoutAnimation in the trigger
    // to handle the smooth transition of the content height.
    if (!isOpen) return null;

    return (
        <View {...props}>
            {children}
        </View>
    );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
