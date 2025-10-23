import { Feather } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from "react";
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import { cn } from "./utils";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const accordionStyles = StyleSheet.create({
    root: {
        width: '100%',
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff1a', // border-b
    },
    trigger: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16, // gap-4
        paddingVertical: 16, // py-4
        outlineWidth: 0,
    },
    triggerText: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#FFFFFF',
        flex: 1,
    },
    chevron: {
        width: 16,
        height: 16,
        color: '#9CA3AF', // text-muted-foreground
        marginLeft: 8,
    },
    contentWrapper: {
        overflow: 'hidden',
    },
    contentInner: {
        paddingTop: 0,
        paddingBottom: 16, // pb-4
    },
    // Styles for open/closed states
    contentClosed: {
        height: 0,
    },
});

// Context to manage state for multiple items
const AccordionContext = React.createContext({});

function Accordion({
    type = "single", // 'single' or 'multiple'
    defaultValue,
    value,
    onValueChange,
    className,
    children,
    ...props
}) {
    const [openItems, setOpenItems] = useState(defaultValue || (type === 'single' ? '' : []));

    const handleToggle = useCallback((itemValue) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (type === 'single') {
            const newValue = openItems === itemValue ? '' : itemValue;
            setOpenItems(newValue);
            if (onValueChange) onValueChange(newValue);
        } else {
            const index = openItems.indexOf(itemValue);
            let newValue;
            if (index > -1) {
                newValue = openItems.filter(v => v !== itemValue);
            } else {
                newValue = [...openItems, itemValue];
            }
            setOpenItems(newValue);
            if (onValueChange) onValueChange(newValue);
        }
    }, [type, openItems, onValueChange]);
    
    // Allow external control via 'value' prop
    const currentValue = value !== undefined ? value : openItems;

    const contextValue = useMemo(() => ({
        currentValue,
        handleToggle,
        type
    }), [currentValue, handleToggle, type]);

    return (
        <AccordionContext.Provider value={contextValue}>
            <View style={cn(accordionStyles.root, className)} {...props}>
                {children}
            </View>
        </AccordionContext.Provider>
    );
}

function AccordionItem({ className, children, value, ...props }) {
    const { currentValue, type } = React.useContext(AccordionContext);
    const isExpanded = type === 'single' ? currentValue === value : currentValue.includes(value);

    // Propagate isExpanded state to children for AccordionContent
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === AccordionContent) {
            return React.cloneElement(child, { isExpanded });
        }
        if (React.isValidElement(child) && child.type === AccordionTrigger) {
            return React.cloneElement(child, { isExpanded, itemValue: value });
        }
        return child;
    });

    return (
        <View
            style={cn(accordionStyles.item, className)}
            {...props}
        >
            {childrenWithProps}
        </View>
    );
}

function AccordionTrigger({ className, children, isExpanded, itemValue, ...props }) {
    const { handleToggle } = React.useContext(AccordionContext);
    
    return (
        <TouchableOpacity
            onPress={() => handleToggle(itemValue)}
            activeOpacity={0.8}
            style={cn(accordionStyles.trigger, className)}
            {...props}
        >
            {/* The primary content/title */}
            <Text style={accordionStyles.triggerText}>{children}</Text>
            
            {/* Chevron Icon */}
            <Feather
                name="chevron-down"
                size={18}
                style={[
                    accordionStyles.chevron,
                    { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }
                ]}
            />
        </TouchableOpacity>
    );
}

function AccordionContent({ className, children, isExpanded, ...props }) {
    // This content needs to be conditionally rendered/sized based on isExpanded
    const [contentHeight, setContentHeight] = useState(0);

    return (
        <View style={accordionStyles.contentWrapper} {...props}>
            <Animated.View
                style={[accordionStyles.contentInner]}
                onLayout={(event) => {
                    if (isExpanded) {
                        // Use LayoutAnimation above, but need height reference if we were using Animated.View for height
                        // For simplicity using LayoutAnimation.Presets.easeInEaseOut works best with RN core.
                    }
                    if (event.nativeEvent.layout.height > 0) {
                        setContentHeight(event.nativeEvent.layout.height);
                    }
                }}
            >
                {isExpanded && <View style={cn(className)}>{children}</View>}
            </Animated.View>
        </View>
    );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
