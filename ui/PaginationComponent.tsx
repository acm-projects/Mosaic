import { Feather } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";
// Assuming Button component/styles are available in the consuming environment,
// but relying on core TouchableOpacity for link functionality here.

const paginationStyles = StyleSheet.create({
    nav: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // gap-1
    },
    item: {
        // No distinct style, wrapper for link/ellipsis
    },
    // Styles for PaginationLink / Button mock
    linkBase: {
        height: 36, // size=icon (size-9)
        width: 36,
        borderRadius: 8, // rounded-md
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    linkText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    variantOutline: {
        backgroundColor: 'transparent',
        borderColor: '#ffffff1a',
        borderWidth: 1,
    },
    variantGhost: {
        backgroundColor: 'transparent',
    },
    // Previous/Next button styles
    prevNextLink: {
        width: 'auto', // Override size=icon width
        paddingHorizontal: 10, // px-2.5
        gap: 4, // gap-1
    },
    hiddenText: {
        fontSize: 14, // sm:block text
        color: '#FFFFFF',
    },
    ellipsis: {
        width: 36, // size-9
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

// Helper for button styling (mimicking buttonVariants logic)
const getLinkStyle = (isActive, size, className) => {
    const base = paginationStyles.linkBase;
    const variant = isActive ? paginationStyles.variantOutline : paginationStyles.variantGhost;
    
    // Apply size overrides if needed (e.g., if size='default' was used)
    const sizeStyle = size === 'default' ? { height: 36, width: 'auto', paddingHorizontal: 12 } : base;

    return cn(base, variant, sizeStyle, className);
};

export function Pagination({ className, children, ...props }) {
  // nav role replaced by View
  return (
    <View
      role="navigation"
      accessibilityLabel="pagination"
      style={cn(paginationStyles.nav, className)}
      {...props}
    >
        {children}
    </View>
  );
}

export function PaginationContent({ className, children, ...props }) {
  // ul role replaced by View
  return (
    <View
      style={cn(paginationStyles.content, className)}
      {...props}
    >
        {children}
    </View>
  );
}

export function PaginationItem({ children, ...props }) {
  // li role replaced by View
  return <View {...props}>{children}</View>;
}

export function PaginationLink({ className, isActive, size = "icon", onPress, children, ...props }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityCurrent={isActive ? "page" : undefined}
            style={getLinkStyle(isActive, size, className)}
            {...props}
        >
            {typeof children === 'string' ? (
                <Text style={paginationStyles.linkText}>{children}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

export function PaginationPrevious({ className, onPress, ...props }) {
  return (
    <PaginationLink
      accessibilityLabel="Go to previous page"
      size="default" // Force default size to show text
      onPress={onPress}
      className={cn(paginationStyles.prevNextLink, className)}
      {...props}
    >
      <Feather name="chevron-left" size={20} color="#FFFFFF" />
      <Text style={paginationStyles.hiddenText}>Previous</Text>
    </PaginationLink>
  );
}

export function PaginationNext({ className, onPress, ...props }) {
  return (
    <PaginationLink
      accessibilityLabel="Go to next page"
      size="default" // Force default size to show text
      onPress={onPress}
      className={cn(paginationStyles.prevNextLink, className)}
      {...props}
    >
      <Text style={paginationStyles.hiddenText}>Next</Text>
      <Feather name="chevron-right" size={20} color="#FFFFFF" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }) {
  return (
    <View
      accessibilityHidden
      style={cn(paginationStyles.ellipsis, className)}
      {...props}
    >
      <Feather name="more-horizontal" size={20} color="#FFFFFF" />
      {/* sr-only span omitted */}
    </View>
  );
}

export {
    Pagination,
    PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
};
