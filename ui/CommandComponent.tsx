import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'; // Use RN mock Dialog
import { cn } from "./utils";

const commandStyles = StyleSheet.create({
    root: {
        backgroundColor: '#1a1a2e', // bg-popover
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderColor: '#ffffff1a', // border-b
        paddingHorizontal: 12,
        height: 48, // Mocked h-12
    },
    inputIcon: {
        width: 16,
        height: 16,
        opacity: 0.5,
    },
    input: {
        flex: 1,
        height: 48, // Mocked h-12
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 0,
    },
    list: {
        maxHeight: 300,
        overflow: 'visible', // scroll-py-1 removed for simplicity
    },
    empty: {
        paddingVertical: 24,
        textAlign: 'center',
        fontSize: 14,
        color: '#9CA3AF',
    },
    group: {
        paddingVertical: 4, // p-1
        overflow: 'hidden',
    },
    groupHeading: {
        paddingHorizontal: 8,
        paddingVertical: 6, // py-1.5
        fontSize: 12,
        fontWeight: '500',
        color: '#9CA3AF', // text-muted-foreground
    },
    separator: {
        height: 1,
        backgroundColor: '#ffffff1a', // bg-border
        marginHorizontal: -4, // -mx-1
        marginVertical: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 4, // rounded-sm
        paddingHorizontal: 8,
        paddingVertical: 10, // py-1.5
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 1,
    },
    itemIcon: {
        width: 16,
        height: 16,
        color: '#9CA3AF', // text-muted-foreground
    },
    itemText: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    itemSelected: {
        backgroundColor: '#5C7AB830', // bg-accent
        color: '#FFFFFF', // text-accent-foreground
    },
    shortcut: {
        marginLeft: 'auto',
        fontSize: 12,
        color: '#9CA3AF', // text-muted-foreground
    },
});

// Context for search term and filtering (simulating cmkd's internal state)
const CommandContext = React.createContext({});

export function Command({ className, children, ...props }) {
    const [search, setSearch] = useState('');

    const contextValue = useMemo(() => ({ search, setSearch }), [search]);

    return (
        <CommandContext.Provider value={contextValue}>
            <View style={cn(commandStyles.root, className)} {...props}>
                {children}
            </View>
        </CommandContext.Provider>
    );
}

export function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, open, onOpenChange, ...props }) {
    // The CommandDialog wraps the Command component inside a Dialog.
    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...props}>
            <DialogContent className={commandStyles.root}>
                {/* Header content moved into Dialog for RN compatibility */}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Command>{children}</Command>
            </DialogContent>
        </Dialog>
    );
}

export function CommandInput({ className, placeholder = "Search...", ...props }) {
    const { setSearch } = React.useContext(CommandContext);

    return (
        <View style={commandStyles.inputWrapper}>
            <Feather name="search" size={16} color="#FFFFFF" style={commandStyles.inputIcon} />
            <TextInput
                onChangeText={setSearch}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                style={cn(commandStyles.input, className)}
                {...props}
            />
        </View>
    );
}

export function CommandList({ className, children, ...props }) {
    return (
        <ScrollView style={cn(commandStyles.list, className)} {...props}>
            {children}
        </ScrollView>
    );
}

export function CommandEmpty({ children = "No results found.", ...props }) {
    const { search } = React.useContext(CommandContext);
    
    // Simple mock: assumes if search is active, results are displayed elsewhere
    if (!search) return null; 

    return (
        <Text style={commandStyles.empty} {...props}>
            {children}
        </Text>
    );
}

export function CommandGroup({ className, heading, children, ...props }) {
    return (
        <View style={cn(commandStyles.group, className)} {...props}>
            {heading && <Text style={commandStyles.groupHeading}>{heading}</Text>}
            {children}
        </View>
    );
}

export function CommandSeparator({ className, ...props }) {
    return (
        <View style={cn(commandStyles.separator, className)} {...props} />
    );
}

export function CommandItem({ className, children, onSelect, selected, disabled, ...props }) {
    const [isPressed, setIsPressed] = useState(false);
    
    return (
        <TouchableOpacity
            onPress={onSelect}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            disabled={disabled}
            activeOpacity={0.7}
            style={cn(
                commandStyles.item,
                (selected || isPressed) && commandStyles.itemSelected,
                disabled && { opacity: 0.5 },
                className
            )}
            {...props}
        >
            {/* Find and render any icons first (e.g., Lucide icons passed as children) */}
            {React.Children.map(children, child => 
                React.isValidElement(child) && child.type.displayName && (child.type.displayName.includes('Feather') || child.type.displayName.includes('Ionicons'))
                    ? React.cloneElement(child, { size: 16, style: commandStyles.itemIcon })
                    : null
            )}
            
            {/* Render text content */}
            {React.Children.map(children, child => 
                typeof child === 'string' || React.isValidElement(child) && child.type !== CommandShortcut && !child.type.displayName?.includes('Icon')
                    ? <Text style={commandStyles.itemText}>{child}</Text>
                    : null
            )}

            {/* Render shortcut */}
            {React.Children.map(children, child => 
                child?.type === CommandShortcut ? child : null
            )}
        </TouchableOpacity>
    );
}

export function CommandShortcut({ className, children, ...props }) {
    return (
        <Text style={cn(commandStyles.shortcut, className)} {...props}>
            {children}
        </Text>
    );
}

export {
    Command,
    CommandDialog, CommandEmpty,
    CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut
};
