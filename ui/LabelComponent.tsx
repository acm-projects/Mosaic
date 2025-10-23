import React from "react";
import { StyleSheet, Text } from "react-native";
import { cn } from "./utils";

const labelStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#FFFFFF',
    },
});

export function Label({ className, children, ...props }) {
  return (
    <Text
      style={cn(labelStyles.root, className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export { Label };
