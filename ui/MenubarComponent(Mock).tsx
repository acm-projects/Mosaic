import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const menubarStyles = StyleSheet.create({
    root: {
        backgroundColor: '#1a1a2e', // bg-background
        flexDirection: 'row',
        height: 36, // h-9
        alignItems: 'center',
        gap: 4, // gap-1
        borderRadius: 8, // rounded-md
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 4, // p-1
    },
    menuItem: {
        paddingHorizontal: 8, // px-2
        paddingVertical: 4, // py-1
        borderRadius: 4, // rounded-sm
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemActive: {
        backgroundColor: '#5C7AB830', // focus:bg-accent
    },
    content: {
        minWidth: 192, // min-w-[12rem]
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
        paddingVertical: 8, // py-1.5
        borderRadius: 4,
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
    },
    shortcut: {
        marginLeft: 'auto',
        fontSize: 12,
        color: '#9CA3AF',
    },
});

const MenubarContext = React.createContext({});

export function Menubar({ className, children, ...props }) {
    const [activeMenu, setActiveMenu] = useState(null);

    const contextValue = useMemo(() => ({ activeMenu, setActiveMenu }), [activeMenu]);
    
    // Inject context into children (MenubarMenu components)
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === MenubarMenu) {
            return React.cloneElement(child, { 
                menuId: child.props.menuId || child.key, // Ensure unique ID for menu
            });
        }
        return child;
    });

    return (
        <MenubarContext.Provider value={contextValue}>
            <View style={cn(menubarStyles.root, className)} {...props}>
                {childrenWithProps}
            </View>
        </MenubarContext.Provider>
    );
}

export function MenubarMenu({ menuId, children, ...props }) {
    const { activeMenu, setActiveMenu } = React.useContext(MenubarContext);
    const open = activeMenu === menuId;

    // Inject open/setActiveMenu into Trigger and Content
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === MenubarTrigger) {
            return React.cloneElement(child, { 
                onPress: () => setActiveMenu(open ? null : menuId),
                isActive: open,
            });
        }
        if (React.isValidElement(child) && child.type === MenubarContent) {
            return React.cloneElement(child, { open, onClose: () => setActiveMenu(null) });
        }
        return child;
    });
    
    return <View {...props}>{childrenWithProps}</View>;
}

export function MenubarTrigger({ className, children, onPress, isActive, ...props }) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.7}
            style={cn(menubarStyles.menuItem, isActive && menubarStyles.menuItemActive, className)}
            {...props}
        >
            <Text style={{color: '#FFFFFF', fontSize: 14}}>{children}</Text>
        </TouchableOpacity>
    );
}

export function MenubarContent({ className, children, open, onClose, ...props }) {
    if (!open) return null; // Simple hidden/visible state

    return (
        <Modal transparent={true} visible={open} onRequestClose={onClose} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1}>
                <View style={cn(menubarStyles.content, className)} {...props}>
                    {children}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export function MenubarItem({ className, children, onPress, variant = "default", ...props }) {
    const isDestructive = variant === 'destructive';
    const textColor = isDestructive ? '#EF4444' : '#FFFFFF';

    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.6}
            style={cn(menubarStyles.item, isDestructive && { backgroundColor: '#EF44441a' }, className)}
            {...props}
        >
            <Text style={[menubarStyles.itemText, { color: textColor }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

export function MenubarSeparator({ className, ...props }) {
    return <View style={cn(menubarStyles.separator, className)} {...props} />;
}

export function MenubarLabel({ className, children, ...props }) {
    return <Text style={cn(menubarStyles.label, className)} {...props}>{children}</Text>;
}

export function MenubarShortcut({ className, children, ...props }) {
    return <Text style={cn(menubarStyles.shortcut, className)} {...props}>{children}</Text>;
}

// Mocking all Radix-specific group/sub-menu/radio/checkbox exports
export const MenubarGroup = ({ children }) => <View>{children}</View>;
export const MenubarPortal = ({ children }) => children;
export const MenubarRadioGroup = ({ children }) => <View>{children}</View>;
export const MenubarCheckboxItem = ({ children }) => <MenubarItem>{children} [Checkbox]</MenubarItem>;
export const MenubarRadioItem = ({ children }) => <MenubarItem>{children} [Radio]</MenubarItem>;
export const MenubarSub = ({ children }) => <View>{children}</View>;
export const MenubarSubTrigger = ({ children }) => <MenubarItem>{children} <Feather name="chevron-right" size={16} color="#FFFFFF" /></MenubarItem>;
export const MenubarSubContent = ({ children }) => <View>{children}</View>;

export {
    Menubar, MenubarCheckboxItem, MenubarContent,
    MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup,
    MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger
};
