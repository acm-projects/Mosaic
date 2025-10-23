import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { cn } from "./utils";

const textareaStyles = StyleSheet.create({
    root: {
        // Base styles for input field
        minHeight: 64, // min-h-16
        width: '100%',
        borderRadius: 8, // rounded-md
        borderWidth: 1,
        paddingHorizontal: 12, // px-3
        paddingVertical: 8, // py-2
        fontSize: 16, // text-base
        textAlignVertical: 'top', // Important for multiline input alignment

        // Theme colors
        color: '#FFFFFF',
        backgroundColor: '#1a1a2e', // bg-input-background (mocked)
        borderColor: '#ffffff1a', // border-input (mocked)
    },
    placeholder: {
        color: '#9CA3AF', // placeholder:text-muted-foreground
    },
});

export const Textarea = React.forwardRef(({ className, style, ...props }, ref) => {
    return (
        <TextInput
            ref={ref}
            style={cn(textareaStyles.root, className, style)}
            placeholderTextColor={textareaStyles.placeholder.color}
            multiline={true}
            numberOfLines={4} // Default visual rows
            editable={!props.disabled}
            {...props}
        />
    );
});

export { Textarea };
