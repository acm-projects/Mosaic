import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cn, createVariants } from "./utils";

// --- Stylesheet for Alert Variants ---
const baseAlertStyles = StyleSheet.create({
    base: {
        width: '100%',
        borderRadius: 8, // rounded-lg
        borderWidth: 1,
        paddingHorizontal: 16, // px-4
        paddingVertical: 12, // py-3
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12, // has-[>svg]:gap-x-3
    },
    icon: {
        width: 16, // size-4
        height: 16,
        marginTop: 2, // translate-y-0.5
        color: '#FFFFFF',
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 4,
    },
    title: {
        fontSize: 14, // text-sm
        fontWeight: '600', // font-medium
        lineHeight: 20,
    },
    description: {
        fontSize: 14, // text-sm
        lineHeight: 20, // leading-relaxed
    }
});

const alertVariants = createVariants(baseAlertStyles.base, {
    variant: {
        default: { 
            backgroundColor: '#1a1a2e', // bg-card
            borderColor: '#ffffff1a', // border
            color: '#FFFFFF', // text-card-foreground
        },
        // Destructive style targeting the red theme
        destructive: {
            backgroundColor: '#1a1a2e', // bg-card (keeping background dark)
            borderColor: '#EF444450', // Destructive border
            color: '#EF4444', // text-destructive
        },
    },
});

export function Alert({ className, variant = "default", icon, children, ...props }) {
    const style = alertVariants({ variant, className });
    const isDestructive = variant === 'destructive';

    // Separate text color based on variant
    const titleColor = isDestructive ? style.color : '#FFFFFF';
    const descriptionColor = isDestructive ? `${style.color}cc` : '#9CA3AF'; // muted-foreground

    const renderChildren = React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        // Pass down determined text styles for Title and Description
        if (child.type === AlertTitle) {
            return React.cloneElement(child, {
                style: [{ color: titleColor }, child.props.style]
            });
        }
        if (child.type === AlertDescription) {
            return React.cloneElement(child, {
                style: [{ color: descriptionColor }, child.props.style]
            });
        }
        return child;
    });

    return (
        <View
            role="alert"
            style={style}
            {...props}
        >
            {/* Icon Slot */}
            {icon && (
                <View style={{ color: titleColor }}>
                    {/* Assuming icon is passed as a React Native element or component */}
                    {icon}
                </View>
            )}

            <View style={baseAlertStyles.contentWrapper}>
                {renderChildren}
            </View>
        </View>
    );
}

export function AlertTitle({ className, children, style, ...props }) {
    return (
        <Text
            style={cn(baseAlertStyles.title, className, style)}
            numberOfLines={1}
            {...props}
        >
            {children}
        </Text>
    );
}

export function AlertDescription({ className, children, style, ...props }) {
    return (
        <Text
            style={cn(baseAlertStyles.description, className, style)}
            {...props}
        >
            {children}
        </Text>
    );
}

export { AlertDescription, AlertTitle };
