import { Film } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { Text, View } from "react-native";
import { Easing } from 'react-native-reanimated';


interface MosaicLogoProps {
    size?: "sm" | "md" | "lg";
}

export function MosaicLogo({ size = "md"}: MosaicLogoProps) {
    const size_map = {
        sm: { text: 18, icon: 16 },
        md: { text: 30, icon: 24 },
        lg: { text: 48, icon: 32 },
    };

    const { text, icon } = size_map[size];

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MotiView
                from={{ scale: 0, rotate: "-90deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                transition={{
                    type: "timing",
                    duration: 600,
                    easing: Easing.bezier(0.23, 1, 0.32, 1)
                }}
            >
                <Film size={icon} color="#818cf8" />
            </MotiView>

            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                    type: "timing",
                    duration: 600,
                    delay: 200,
                    easing: Easing.bezier(0.23, 1, 0.32, 1),
                }}
            >
                <Text
                    style={{
                        fontSize: text,
                        fontWeight: "bold",
                        color: "#818cf8",
                    }}
                >
                    Mosaic
                </Text>
            </MotiView>
        </View>
    );
}
