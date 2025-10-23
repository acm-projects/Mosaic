import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const TabsContext = React.createContext({
    value: null,
    onValueChange: () => {},
});

const tabsStyles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        gap: 8, // gap-2
        width: '100%',
    },
    list: {
        backgroundColor: '#1a1a2e', // bg-muted
        flexDirection: 'row',
        height: 36, // h-9
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12, // rounded-xl
        padding: 3, // p-[3px]
    },
    trigger: {
        flex: 1,
        height: '100%', // h-[calc(100%-1px)]
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12, // rounded-xl
        paddingHorizontal: 8, // px-2
        paddingVertical: 4, // py-1
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#FFFFFF', // text-foreground
    },
    triggerActive: {
        backgroundColor: '#0a0a1a', // data-[state=active]:bg-card (mocked)
        color: '#FFFFFF', // dark:data-[state=active]:text-foreground
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    content: {
        flex: 1,
        width: '100%',
    },
    textBase: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    textInactive: {
        color: '#9CA3AF',
    }
});

export function Tabs({ className, value, onValueChange, defaultValue, children, ...props }) {
    const [internalValue, setInternalValue] = useState(defaultValue || null);
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = useCallback((newValue) => {
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    }, [onValueChange]);
    
    const contextValue = useMemo(() => ({ value: currentValue, onValueChange: handleValueChange }), [currentValue, handleValueChange]);

    return (
        <TabsContext.Provider value={contextValue}>
            <View style={cn(tabsStyles.root, className)} {...props}>
                {children}
            </View>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children, ...props }) {
    return (
        <View style={cn(tabsStyles.list, className)} {...props}>
            {children}
        </View>
    );
}

export function TabsTrigger({ className, value, children, ...props }) {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext);
    const isActive = activeValue === value;

    return (
        <TouchableOpacity
            onPress={() => onValueChange(value)}
            activeOpacity={0.8}
            style={cn(tabsStyles.trigger, isActive && tabsStyles.triggerActive, className)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            {...props}
        >
            <Text style={cn(tabsStyles.textBase, !isActive && tabsStyles.textInactive)}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

export function TabsContent({ className, value, children, ...props }) {
    const { value: activeValue } = React.useContext(TabsContext);
    const isActive = activeValue === value;
    
    if (!isActive) {
        return null;
    }

    return (
        <View style={cn(tabsStyles.content, className)} accessibilityRole="tabpanel" {...props}>
            {children}
        </View>
    );
}

// Mocking Radix-specific exports
export { Tabs, TabsContent, TabsList, TabsTrigger };

