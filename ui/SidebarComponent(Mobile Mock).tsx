import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";
// Import mocks from ui folder
import { Separator } from './separator';
import { Sheet, SheetContent } from './sheet';

const { width } = Dimensions.get('window');

const sidebarStyles = StyleSheet.create({
    // --- Context & Provider Mock ---
    wrapper: {
        flex: 1,
    },
    // --- Sidebar Component (The Mobile Sheet) ---
    sheetContent: {
        backgroundColor: '#0a0a1a', // bg-sidebar
        padding: 0, // p-0
        width: width * 0.75, // w-3/4 default
        gap: 0,
    },
    inner: {
        flex: 1,
        flexDirection: 'column',
    },
    // --- Header/Footer/Input/Content ---
    header: {
        padding: 16, // p-4
        paddingBottom: 8,
        gap: 8, // gap-2
    },
    footer: {
        padding: 16, // p-4
        paddingTop: 8,
        gap: 8, // gap-2
        marginTop: 'auto',
    },
    content: {
        flex: 1,
        padding: 8, // p-2
        gap: 4, // gap-2
        overflow: 'visible',
    },
    // --- Menu Items ---
    menu: {
        gap: 4, // gap-1
    },
    menuButton: {
        height: 32, // h-8
        paddingHorizontal: 8, // p-2
        borderRadius: 6, // rounded-md
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    menuButtonActive: {
        backgroundColor: '#5C7AB830', // data-[active=true]:bg-sidebar-accent
    },
    menuButtonText: {
        fontSize: 14, // text-sm
        color: '#FFFFFF',
    },
    menuButtonIcon: {
        width: 16, // size-4
        height: 16,
    }
});

// --- Context Mock ---
const SidebarContext = React.createContext({ 
    isMobile: true, 
    toggleSidebar: () => {},
    openMobile: false,
    setOpenMobile: () => {},
});
export function useSidebar() { return React.useContext(SidebarContext); }

// --- Provider Mock ---
export function SidebarProvider({ open: openProp, onOpenChange: setOpenProp, children, ...props }) {
    const [openMobile, setOpenMobile] = useState(openProp || false);
    
    // Simplify control to always use the prop/onChange if provided, otherwise internal state
    const setOpen = setOpenProp || setOpenMobile;
    const open = openProp !== undefined ? openProp : openMobile;

    const toggleSidebar = useCallback(() => setOpen(!open), [open, setOpen]);

    const contextValue = useMemo(() => ({
        isMobile: true, // Always mock as mobile environment
        openMobile: open,
        setOpenMobile: setOpen,
        toggleSidebar,
    }), [open, setOpen, toggleSidebar]);

    return (
        <SidebarContext.Provider value={contextValue}>
            <View style={sidebarStyles.wrapper} {...props}>
                {children}
            </View>
        </SidebarContext.Provider>
    );
}

// --- Sidebar (Mobile Sheet Implementation) ---
export function Sidebar({ open, onOpenChange, children, side = "left", ...props }) {
    const { setOpenMobile, openMobile } = useSidebar();
    
    // Use local open/onOpenChange if provided, otherwise fall back to context state (mocking mobile behavior)
    const currentOpen = open !== undefined ? open : openMobile;
    const currentOnOpenChange = onOpenChange || setOpenMobile;

    return (
      <Sheet open={currentOpen} onOpenChange={currentOnOpenChange} side={side} {...props}>
        <SheetContent
          className={sidebarStyles.sheetContent}
          side={side}
        >
          {/* Inner Content Wrapper */}
          <View style={sidebarStyles.inner}>
            {children}
          </View>
        </SheetContent>
      </Sheet>
    );
}

// --- Sub Components ---
export function SidebarTrigger({ className, onPress, ...props }) {
    const { toggleSidebar } = useSidebar();

    return (
        <TouchableOpacity
            onPress={() => {
                onPress?.();
                toggleSidebar();
            }}
            activeOpacity={0.7}
            style={cn(sidebarStyles.menuButton, className)}
            {...props}
        >
            <Feather name="menu" size={20} color="#FFFFFF" />
            {/* sr-only span omitted */}
        </TouchableOpacity>
    );
}

export function SidebarHeader({ className, children, ...props }) {
  return <View style={cn(sidebarStyles.header, className)} {...props}>{children}</View>;
}

export function SidebarFooter({ className, children, ...props }) {
  return <View style={cn(sidebarStyles.footer, className)} {...props}>{children}</View>;
}

export function SidebarContent({ className, children, ...props }) {
  return <ScrollView style={cn(sidebarStyles.content, className)} {...props}>{children}</ScrollView>;
}

export function SidebarMenu({ className, children, ...props }) {
  return <View style={cn(sidebarStyles.menu, className)} {...props}>{children}</View>;
}

export function SidebarMenuButton({ className, children, isActive = false, onPress, ...props }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={isActive ? 1 : 0.7}
            style={cn(sidebarStyles.menuButton, isActive && sidebarStyles.menuButtonActive, className)}
            {...props}
        >
            {/* Find and render any icon passed as a child */}
            {React.Children.map(children, child => 
                React.isValidElement(child) && (child.type.displayName?.includes('Feather') || child.type.displayName?.includes('Ionicons')) 
                    ? React.cloneElement(child, { size: 16, style: sidebarStyles.menuButtonIcon })
                    : null
            )}
            {/* Render text content */}
            {React.Children.map(children, child => 
                typeof child === 'string' || !React.isValidElement(child) 
                    ? <Text style={sidebarStyles.menuButtonText} numberOfLines={1}>{child}</Text>
                    : null
            )}
        </TouchableOpacity>
    );
}

// Mocking all complex/desktop/web-specific exports
export const SidebarSeparator = Separator;
export const SidebarInset = View;
export const SidebarRail = View;
export const SidebarInput = View;
export const SidebarMenuSub = View;
export const SidebarGroup = View;
export const SidebarGroupLabel = Text;
export const SidebarGroupContent = View;
export const SidebarGroupAction = TouchableOpacity;
export const SidebarMenuAction = TouchableOpacity;
export const SidebarMenuBadge = Text;
export const SidebarMenuSkeleton = View;
export const SidebarMenuItem = View;
export const SidebarMenuSubItem = View;
export const SidebarMenuSubButton = TouchableOpacity;


export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar
};
