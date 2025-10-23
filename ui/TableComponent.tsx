import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const tableStyles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    // --- Head/Body/Row/Cell ---
    header: {
        borderBottomWidth: 1,
        borderColor: '#ffffff1a', // [&_tr]:border-b
    },
    body: {
        // [&_tr:last-child]:border-0
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#ffffff1a',
        backgroundColor: '#5C7AB81a', // bg-muted/50 (mocked)
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ffffff1a',
        paddingVertical: 8, // padding mock
    },
    head: {
        flex: 1,
        paddingHorizontal: 8, // px-2
        height: 40, // h-10
        justifyContent: 'center',
        color: '#FFFFFF', // text-foreground
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
    },
    cell: {
        flex: 1,
        paddingHorizontal: 8, // p-2
        justifyContent: 'center',
        fontSize: 14, // text-sm
        color: '#FFFFFF',
    },
    caption: {
        marginTop: 16, // mt-4
        fontSize: 14,
        color: '#9CA3AF', // text-muted-foreground
        textAlign: 'center',
    }
});

export function Table({ className, children, ...props }) {
  // Use ScrollView to handle horizontal overflow (overflow-x-auto)
  return (
    <View style={cn(tableStyles.container, className)} {...props}>
      <ScrollView horizontal={true} contentContainerStyle={tableStyles.table}>
        <View style={{ flex: 1 }}>
            {children}
        </View>
      </ScrollView>
    </View>
  );
}

export function TableHeader({ className, children, ...props }) {
  return <View style={cn(tableStyles.header, className)} {...props}>{children}</View>;
}

export function TableBody({ className, children, ...props }) {
  return <View style={cn(tableStyles.body, className)} {...props}>{children}</View>;
}

export function TableFooter({ className, children, ...props }) {
  return <View style={cn(tableStyles.footer, className)} {...props}>{children}</View>;
}

export function TableRow({ className, children, onSelect, isSelected, ...props }) {
    const handlePress = () => {
        if (onSelect) onSelect();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={onSelect ? 0.7 : 1.0}
            style={cn(
                tableStyles.row, 
                isSelected && { backgroundColor: '#5C7AB81a' }, 
                className
            )}
            {...props}
        >
            {children}
        </TouchableOpacity>
    );
}

export function TableHead({ className, children, ...props }) {
    return (
        <Text style={cn(tableStyles.head, className)} {...props}>
            {children}
        </Text>
    );
}

export function TableCell({ className, children, ...props }) {
    return (
        <Text style={cn(tableStyles.cell, className)} {...props}>
            {children}
        </Text>
    );
}

export function TableCaption({ className, children, ...props }) {
    return (
        <Text style={cn(tableStyles.caption, className)} {...props}>
            {children}
        </Text>
    );
}

export {
    Table, TableBody, TableCaption, TableCell, TableFooter,
    TableHead, TableHeader, TableRow
};
