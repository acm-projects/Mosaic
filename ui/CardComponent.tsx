import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a2e', // bg-card
        color: '#FFFFFF', // text-card-foreground
        flexDirection: 'column',
        gap: 24, // gap-6
        borderRadius: 12, // rounded-xl
        borderWidth: 1,
        borderColor: '#ffffff1a', // border
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 24, // px-6
        paddingTop: 24, // pt-6
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12, // gap-1.5
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        flexShrink: 1,
    },
    description: {
        fontSize: 14,
        color: '#9CA3AF', // text-muted-foreground
        marginTop: 4,
    },
    action: {
        // Aligned to top right of header
    },
    content: {
        paddingHorizontal: 24, // px-6
        paddingBottom: 24, // pb-6
        // NOTE: The web version had complex logic for padding based on children. RN simplifies this.
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24, // px-6
        paddingBottom: 24, // pb-6
        paddingTop: 0,
        borderTopWidth: 1,
        borderColor: '#ffffff1a',
    }
});

export function Card({ className, children, ...props }) {
  return (
    <View
      style={cn(cardStyles.card, className)}
      {...props}
    >
        {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }) {
    // Determine if action slot is present to adjust layout
    const hasAction = React.Children.toArray(children).some(
        child => child?.props?.['data-slot'] === 'card-action'
    );

    return (
        <View
            style={cn(cardStyles.header, className, hasAction && { justifyContent: 'space-between' })}
            {...props}
        >
            {hasAction ? (
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        {React.Children.map(children, child => 
                            child?.props?.['data-slot'] !== 'card-action' ? child : null
                        )}
                    </View>
                    {React.Children.map(children, child => 
                        child?.props?.['data-slot'] === 'card-action' ? child : null
                    )}
                </View>
            ) : (
                children
            )}
        </View>
    );
}

export function CardTitle({ className, children, ...props }) {
  // Use Text for title
  return (
    <Text
      style={cn(cardStyles.title, className)}
      {...props}
    >
        {children}
    </Text>
  );
}

export function CardDescription({ className, children, ...props }) {
  // Use Text for description
  return (
    <Text
      style={cn(cardStyles.description, className)}
      {...props}
    >
        {children}
    </Text>
  );
}

export function CardAction({ className, children, ...props }) {
  // Use TouchableOpacity to wrap action items, typically buttons/links
  return (
    <TouchableOpacity
        data-slot="card-action"
        style={cn(cardStyles.action, className)}
        {...props}
    >
        {children}
    </TouchableOpacity>
  );
}

export function CardContent({ className, children, ...props }) {
  // Use View for content wrapper
  return (
    <View
      style={cn(cardStyles.content, className)}
      {...props}
    >
        {children}
    </View>
  );
}

export function CardFooter({ className, children, ...props }) {
  // Use View for footer wrapper
  return (
    <View
      style={cn(cardStyles.footer, className)}
      {...props}
    >
        {children}
    </View>
  );
}

export {
    Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};
