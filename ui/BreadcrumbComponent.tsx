import { Feather } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const breadcrumbStyles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6, // gap-1.5, sm:gap-2.5
        fontSize: 14, // text-sm
        color: '#9CA3AF', // text-muted-foreground
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
    },
    link: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    page: {
        color: '#FFFFFF', // text-foreground
        fontWeight: 'normal',
        fontSize: 14,
    },
    separator: {
        width: 14, // size-3.5
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ellipsisWrapper: {
        width: 36, // size-9
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export function Breadcrumb({ children, ...props }) {
  // Navigation wrapper, replaced with simple View
  return <View aria-label="breadcrumb" {...props}>{children}</View>;
}

export function BreadcrumbList({ className, children, ...props }) {
  // ol replaced with View
  return (
    <View
      style={cn(breadcrumbStyles.list, className)}
      {...props}
    >
      {children}
    </View>
  );
}

export function BreadcrumbItem({ className, children, ...props }) {
  // li replaced with View
  return (
    <View
      style={cn(breadcrumbStyles.item, className)}
      {...props}
    >
      {children}
    </View>
  );
}

export function BreadcrumbLink({ className, onPress, children, ...props }) {
  // 'a' replaced with TouchableOpacity/Text
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} {...props}>
        <Text style={cn(breadcrumbStyles.link, className)}>
            {children}
        </Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({ className, children, ...props }) {
  // span replaced with Text
  return (
    <Text
      role="link"
      aria-disabled="true"
      aria-current="page"
      style={cn(breadcrumbStyles.page, className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function BreadcrumbSeparator({ children, className, ...props }) {
  // li replaced with View
  return (
    <View
      role="presentation"
      aria-hidden="true"
      style={cn(breadcrumbStyles.separator, className)}
      {...props}
    >
      {children || <Feather name="chevron-right" size={14} color="#9CA3AF" />}
    </View>
  );
}

export function BreadcrumbEllipsis({ className, ...props }) {
  // span replaced with View
  return (
    <View
      role="presentation"
      aria-hidden="true"
      style={cn(breadcrumbStyles.ellipsisWrapper, className)}
      {...props}
    >
      <Feather name="more-horizontal" size={16} color="#9CA3AF" />
      {/* sr-only span replaced with accessibility label if needed */}
    </View>
  );
}

export {
    Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
};
