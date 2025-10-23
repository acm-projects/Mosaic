import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const navStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 4,
        backgroundColor: '#0a0a1a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffffff1a',
    },
    list: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    item: {
        // Wrapper for trigger
    },
    trigger: {
        height: 36, // h-9
        paddingHorizontal: 16, // px-4
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    triggerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    content: {
        minWidth: 200,
        backgroundColor: '#1a1a2e',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10,
    },
    link: {
        padding: 8,
        borderRadius: 4,
    }
});

const NavigationMenuContext = React.createContext({});

export function NavigationMenu({ className, children, ...props }) {
    const [activeItem, setActiveItem] = useState(null);

    const contextValue = useMemo(() => ({ activeItem, setActiveItem }), [activeItem]);
    
    return (
        <NavigationMenuContext.Provider value={contextValue}>
            <View style={cn(navStyles.root, className)} {...props}>
                {children}
            </View>
        </NavigationMenuContext.Provider>
    );
}

export function NavigationMenuList({ className, children, ...props }) {
    return <View style={cn(navStyles.list, className)} {...props}>{children}</View>;
}

export function NavigationMenuItem({ className, children, ...props }) {
    return <View style={cn(navStyles.item, className)} {...props}>{children}</View>;
}

export function NavigationMenuTrigger({ className, children, itemValue, ...props }) {
    const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext);
    const open = activeItem === itemValue;
    
    const handlePress = () => setActiveItem(open ? null : itemValue);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={cn(navStyles.trigger, open && navStyles.menuItemActive, className)}
            {...props}
        >
            <Text style={navStyles.triggerText}>{children}</Text>
            <Feather 
                name="chevron-down" 
                size={16} 
                color="#FFFFFF" 
                style={{ marginLeft: 4, transform: [{ rotate: open ? '180deg' : '0deg' }] }}
            />
        </TouchableOpacity>
    );
}

export function NavigationMenuContent({ className, children, itemValue, ...props }) {
    const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext);
    const open = activeItem === itemValue;

    if (!open) return null;
    
    // Mock the content display using a simple absolute positioned view/modal
    return (
        <Modal transparent={true} visible={open} onRequestClose={() => setActiveItem(null)} animationType="fade">
            <TouchableOpacity style={navStyles.overlay} onPress={() => setActiveItem(null)} activeOpacity={1}>
                <View style={cn(navStyles.content, { position: 'absolute', top: 50, left: 10 }, className)} {...props}>
                    {children}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export function NavigationMenuLink({ className, children, onPress, ...props }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={cn(navStyles.link, className)}
            {...props}
        >
            <Text style={navStyles.triggerText}>{children}</Text>
        </TouchableOpacity>
    );
}

// Mocking all complex/Radix-specific components/exports
export const NavigationMenuViewport = () => null;
export const NavigationMenuIndicator = () => null;

export {
    NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport
};
