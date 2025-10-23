import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";

// --- Chart Component (Mock - non-functional chart container) ---
// This mocks the visual presence of a chart container and legend/tooltip structure,
// but does not include any Recharts logic.

const chartStyles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e', // Mock background
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff1a',
    },
    mockText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    legendContainer: {
        flexDirection: 'row',
        gap: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#ffffff1a',
        width: '90%',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});

// Mock Chart Context
const ChartContext = React.createContext({});
function useChart() { return React.useContext(ChartContext); }

export function ChartContainer({ id, className, config, children, ...props }) {
    const contextValue = React.useMemo(() => ({ config }), [config]);
    
    // We render the children, assuming they contain the mock legend
    return (
        <ChartContext.Provider value={contextValue}>
            <View style={cn(chartStyles.container, className)} {...props}>
                <Text style={chartStyles.mockText}>[Data Chart Mock]</Text>
                {children}
            </View>
        </ChartContext.Provider>
    );
}

export function ChartLegendContent({ payload, verticalAlign = "bottom", ...props }) {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
        <View style={chartStyles.legendContainer} {...props}>
            {payload.map((item) => {
                // Mock payload parsing based on mock config
                const itemConfig = config?.[item.dataKey || ''] || { label: item.dataKey, color: item.color };

                return (
                    <View key={item.dataKey} style={chartStyles.legendItem}>
                        <View style={[chartStyles.legendDot, { backgroundColor: itemConfig.color || item.color }]} />
                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                            {itemConfig.label || item.dataKey}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

// Mocking all other Recharts exports
export const ChartTooltipContent = ({ payload }) => {
    if (!payload?.length) return null;
    return (
        <View style={{ backgroundColor: '#000000', padding: 8, borderRadius: 4 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>{payload[0].name}: {payload[0].value}</Text>
        </View>
    );
};
export const ChartTooltip = ({ children }) => children;
export const ChartLegend = ({ children }) => children;
export const ChartStyle = () => null;

export {
    ChartContainer, ChartLegend,
    ChartLegendContent,
    ChartStyle, ChartTooltip,
    ChartTooltipContent
};
