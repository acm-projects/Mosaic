import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { cn } from "./utils";

const scrollAreaStyles = StyleSheet.create({
    root: {
        // Inherits size from parent
        flex: 1,
    },
    // Viewport is essentially the ScrollView itself in RN
    viewport: {
        flex: 1,
        borderRadius: 8, // rounded-[inherit]
        // Native scrollbars are typically platform-specific and styled via props below
    }
});

export function ScrollArea({ className, children, ...props }) {
    return (
        <ScrollView
            style={cn(scrollAreaStyles.root, className)}
            // Viewport is the ScrollView content itself
            contentContainerStyle={scrollAreaStyles.viewport}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            {...props}
        >
            {children}
        </ScrollView>
    );
}

export function ScrollBar({ orientation = "vertical", ...props }) {
    // Scrollbars are controlled by platform/ScrollView props in RN, so this is a no-op mock component.
    return null;
}

export { ScrollArea, ScrollBar };
