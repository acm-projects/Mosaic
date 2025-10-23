import { Feather } from '@expo/vector-icons'; // For fallback icon
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";

const avatarStyles = StyleSheet.create({
    root: {
        position: 'relative',
        flexDirection: 'row',
        width: 40, // size-10
        height: 40,
        borderRadius: 9999, // rounded-full
        overflow: 'hidden',
        flexShrink: 0,
    },
    image: {
        aspectRatio: 1,
        width: '100%',
        height: '100%',
    },
    fallback: {
        backgroundColor: '#374151', // bg-muted (gray-700 equivalent)
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9999,
    },
    fallbackText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export function Avatar({ className, children, style, ...props }) {
  return (
    <View
      style={cn(avatarStyles.root, className, style)}
      {...props}
    >
      {children}
    </View>
  );
}

export function AvatarImage({ className, source, style, ...props }) {
  // RN Image component uses 'source' prop
  return (
    <Image
      source={source}
      style={cn(avatarStyles.image, className, style)}
      resizeMode="cover"
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, style, ...props }) {
  return (
    <View
      style={cn(avatarStyles.fallback, className, style)}
      {...props}
    >
      {/* Fallback can be a single character or an icon */}
      {typeof children === 'string' ? (
        <Text style={avatarStyles.fallbackText}>{children.slice(0, 1).toUpperCase()}</Text>
      ) : (
        children || <Feather name="user" size={24} color="#FFFFFF" />
      )}
    </View>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
