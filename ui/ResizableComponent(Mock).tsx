import { Feather } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, View } from "react-native";
import { cn } from "./utils";

const resizableStyles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
    },
    panel: {
        flex: 1, // Default flex behavior
        overflow: 'hidden',
    },
    handle: {
        backgroundColor: '#ffffff1a', // bg-border
        width: 1, // w-px
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4, // Visual spacing
    },
    handleInner: {
        width: 12, // w-3
        height: 16, // h-4
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ffffff1a',
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

// ResizablePanelGroup (Replaces ResizablePrimitive.PanelGroup)
export function ResizablePanelGroup({ className, direction = "horizontal", children, ...props }) {
  const style = direction === 'horizontal' ? resizableStyles.group : [resizableStyles.group, { flexDirection: 'column' }];
  
  return (
    <View style={cn(style, className)} {...props}>
      {children}
    </View>
  );
}

// ResizablePanel (Replaces ResizablePrimitive.Panel)
export function ResizablePanel({ className, children, defaultSize = 50, ...props }) {
  // Use flexBasis to simulate size property in RN
  const style = { flex: 0, flexBasis: `${defaultSize}%` };

  return (
    <View style={cn(resizableStyles.panel, style, className)} {...props}>
      {children}
    </View>
  );
}

// ResizableHandle (Replaces ResizablePrimitive.PanelResizeHandle)
export function ResizableHandle({ withHandle, className, ...props }) {
  return (
    // Mock handle as a non-functional separator
    <View style={cn(resizableStyles.handle, className)} {...props}>
      {withHandle && (
        <View style={resizableStyles.handleInner}>
          <Feather name="maximize" size={10} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>
      )}
    </View>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
