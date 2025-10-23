import { Feather } from '@expo/vector-icons';
import React from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const dialogStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)', // fixed inset-0 z-50 bg-black/50
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    content: {
        backgroundColor: '#1a1a2e', // bg-background (mocked card bg)
        width: '100%',
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
        gap: 16,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
        zIndex: 10,
    },
    header: {
        flexDirection: 'column',
        gap: 8, // gap-2
        alignItems: 'center', // sm:text-left alignment depends on context
    },
    footer: {
        flexDirection: 'row-reverse', // sm:flex-row sm:justify-end
        gap: 8, // gap-2
        marginTop: 8,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: '600', // font-semibold
        color: '#FFFFFF',
        textAlign: 'center', // Default to center for mobile
    },
    description: {
        fontSize: 14, // text-sm
        color: '#9CA3AF', // text-muted-foreground
        textAlign: 'center', // Default to center for mobile
    },
});

// Context to handle open/close state and functions
const DialogContext = React.createContext({});

// Root Dialog component (replaces DialogPrimitive.Root)
export function Dialog({ open, onOpenChange, children, ...props }) {
  const contextValue = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);

  return (
    <DialogContext.Provider value={contextValue}>
      <Modal
        transparent={true}
        visible={open}
        onRequestClose={() => onOpenChange && onOpenChange(false)}
        animationType="fade"
        {...props}
      >
        {/* We use DialogOverlay and Content directly inside the Modal */}
        <DialogOverlay>
            <DialogContent>{children}</DialogContent>
        </DialogOverlay>
      </Modal>
    </DialogContext.Provider>
  );
}

// DialogOverlay (replaces DialogPrimitive.Overlay)
export function DialogOverlay({ className, children, ...props }) {
    return (
        <View style={cn(dialogStyles.overlay, dialogStyles.contentWrapper, className)} {...props}>
            {children}
        </View>
    );
}

// DialogContent (replaces DialogPrimitive.Content)
export function DialogContent({ className, children, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext);
  
  return (
    <View style={cn(dialogStyles.content, className)} {...props}>
      {children}
      
      {/* Close Button */}
      <TouchableOpacity 
        onPress={() => onOpenChange && onOpenChange(false)}
        style={dialogStyles.closeButton}
      >
        <Feather name="x" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// Simple wrapper components (replaces DialogPrimitive.Header, Footer, Title, Description)
export function DialogHeader({ className, children, ...props }) {
  return <View style={cn(dialogStyles.header, className)} {...props}>{children}</View>;
}

export function DialogFooter({ className, children, ...props }) {
  return <View style={cn(dialogStyles.footer, className)} {...props}>{children}</View>;
}

export function DialogTitle({ className, children, ...props }) {
  return <Text style={cn(dialogStyles.title, className)} {...props}>{children}</Text>;
}

export function DialogDescription({ className, children, ...props }) {
  return <Text style={cn(dialogStyles.description, className)} {...props}>{children}</Text>;
}

// Mocking Radix-specific components/exports not used in RN directly
export const DialogTrigger = ({ children, onPress }) => children;
export const DialogClose = ({ children, onPress }) => children;
export const DialogPortal = ({ children }) => children;


export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
};
