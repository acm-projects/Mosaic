import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";
// buttonVariants must be imported, but we use the RNButton from the main project.
import { RNButton } from "../UI"; // Assuming RNButton is available in a higher scope like src/components/UI

const alertDialogStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)', // fixed inset-0 z-50 bg-black/50
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#1a1a2e', // bg-background (mocked card bg)
        width: '90%',
        maxWidth: 500, // sm:max-w-lg
        borderRadius: 8, // rounded-lg
        borderWidth: 1,
        borderColor: '#ffffff1a',
        padding: 24, // p-6
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        flexDirection: 'column',
        gap: 8, // gap-2
        alignItems: 'center', // text-center
    },
    footer: {
        flexDirection: 'row-reverse', // flex-col-reverse -> sm:flex-row sm:justify-end
        gap: 8, // gap-2
        marginTop: 24,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: '600', // font-semibold
        color: '#FFFFFF',
    },
    description: {
        fontSize: 14, // text-sm
        color: '#9CA3AF', // text-muted-foreground
        textAlign: 'center',
    },
});

// Root component using Modal for visibility
export function AlertDialog({ open, onOpenChange, children, ...props }) {
  return (
    <Modal
      transparent={true}
      visible={open}
      onRequestClose={() => onOpenChange && onOpenChange(false)}
      animationType="fade"
      {...props}
    >
        <AlertDialogOverlay />
        {/* We expect AlertDialogContent to be a direct child */}
        {children}
    </Modal>
  );
}

// Separate component to handle the overlay style
export function AlertDialogOverlay({ className, ...props }) {
    return (
        <View style={cn(alertDialogStyles.overlay, className)} {...props}>
            {/* The overlay is just a background, the modal handles the center positioning */}
        </View>
    );
}

// Content component that wraps the actual modal content
export function AlertDialogContent({ className, children, ...props }) {
  // Use a final View to contain the actual dialog content within the overlay
  return (
    <View style={cn(alertDialogStyles.content, className)} {...props}>
        {children}
    </View>
  );
}

export function AlertDialogHeader({ className, children, ...props }) {
  return (
    <View style={cn(alertDialogStyles.header, className)} {...props}>
        {children}
    </View>
  );
}

export function AlertDialogFooter({ className, children, ...props }) {
  return (
    <View style={cn(alertDialogStyles.footer, className)} {...props}>
        {children}
    </View>
  );
}

export function AlertDialogTitle({ className, children, ...props }) {
  return (
    <Text style={cn(alertDialogStyles.title, className)} {...props}>
        {children}
    </Text>
  );
}

export function AlertDialogDescription({ className, children, ...props }) {
  return (
    <Text style={cn(alertDialogStyles.description, className)} {...props}>
        {children}
    </Text>
  );
}

// Action and Cancel need to be wrapped in TouchableOpacity and styled like buttons.
// They use the RNButton component (which needs to be available/imported in the using screen).
export function AlertDialogAction({ className, children, onPress, ...props }) {
    return (
        <RNButton 
            onPress={onPress} 
            title={children} 
            style={cn({ flex: 1 }, className)} 
            {...props} 
        />
    );
}

export function AlertDialogCancel({ className, children, onPress, ...props }) {
    return (
        <RNButton 
            onPress={onPress} 
            title={children} 
            variant="outline" 
            style={cn({ flex: 1, borderColor: '#ffffff33' }, className)} 
            {...props} 
        />
    );
}

// Mocking Radix-specific components not used in RN directly
export function AlertDialogTrigger({ children, onPress }) {
    if (React.Children.count(children) !== 1) return null;
    return React.cloneElement(children, { onPress });
}
export const AlertDialogPortal = ({ children }) => children;

export {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogTitle, AlertDialogTrigger
};
