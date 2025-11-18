import { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export function use_swipe_card(on_swipe?: (dir: "left" | "right" | "skip") => void) {
    const position = useRef(new Animated.ValueXY()).current;
    const [swipe_direction, set_swipe_direction] =
        useState<"left" | "right" | "skip" | null>(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });

                if (gesture.dx > 30) set_swipe_direction("right");
                else if (gesture.dx < -30) set_swipe_direction("left");
                else if (gesture.dy < -30) set_swipe_direction("skip");
                else set_swipe_direction(null);
            },
            onPanResponderRelease: (_, gesture) => {
                let direction: "left" | "right" | "skip" | null = null;

                if (gesture.dx > SWIPE_THRESHOLD) direction = "right";
                else if (gesture.dx < -SWIPE_THRESHOLD) direction = "left";
                else if (gesture.dy < -SWIPE_THRESHOLD / 2) direction = "skip";

                if (direction) {
                    const toValue =
                        direction === "right"
                            ? { x: width + 200, y: gesture.dy }
                            : direction === "left"
                                ? { x: -width - 200, y: gesture.dy }
                                : { x: 0, y: -600 };

                    Animated.timing(position, {
                        toValue,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        position.setValue({ x: 0, y: 0 });
                        set_swipe_direction(null);
                        on_swipe?.(direction);
                    });
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start(() => set_swipe_direction(null));
                }
            },
        })
    ).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ["-15deg", "0deg", "15deg"],
        extrapolate: "clamp",
    });

    const cardStyle = {
        transform: [...position.getTranslateTransform(), { rotate }],
    };

    return { panHandlers: panResponder.panHandlers, cardStyle, swipeDirection: swipe_direction };
}
