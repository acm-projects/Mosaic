import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const carouselStyles = StyleSheet.create({
    root: {
        position: 'relative',
        width: '100%',
    },
    contentWrapper: {
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
    },
    item: {
        width: width, // Full width item
        minWidth: 0,
        flexShrink: 0,
        grow: 0,
    },
    button: {
        position: 'absolute',
        top: '50%',
        width: 32, // size-8
        height: 32,
        borderRadius: 16, // rounded-full
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: '#1a1a2e', // outline bg
        borderWidth: 1,
        borderColor: '#ffffff1a',
        transform: [{ translateY: -16 }], // -translate-y-1/2
    },
    prevButton: {
        left: 12, // Arbitrary small offset
    },
    nextButton: {
        right: 12,
    },
});

const CarouselContext = React.createContext(null);

// Custom mock API for RN ScrollView
function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

export function Carousel({
    orientation = "horizontal",
    className,
    children,
    ...props
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    
    // Mock the number of items based on children
    const items = React.Children.toArray(children).find(child => child.type === CarouselContent)?.props.children || [];
    const totalItems = React.Children.count(items);

    const scrollPrev = useCallback(() => {
        if (scrollRef.current && currentIndex > 0) {
            scrollRef.current.scrollTo({ x: (currentIndex - 1) * width, animated: true });
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex]);

    const scrollNext = useCallback(() => {
        if (scrollRef.current && currentIndex < totalItems - 1) {
            scrollRef.current.scrollTo({ x: (currentIndex + 1) * width, animated: true });
            setCurrentIndex(currentIndex + 1);
        }
    }, [currentIndex, totalItems]);
    
    // Handle scroll end (for natural user scrolling)
    const handleScroll = useCallback((event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(xOffset / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    }, [currentIndex]);
    
    const contextValue = useMemo(() => ({
        orientation,
        scrollRef,
        scrollPrev,
        scrollNext,
        canScrollPrev: currentIndex > 0,
        canScrollNext: currentIndex < totalItems - 1,
    }), [orientation, scrollPrev, scrollNext, currentIndex, totalItems]);

    return (
        <CarouselContext.Provider value={contextValue}>
            <View style={cn(carouselStyles.root, className)} {...props}>
                {children}
            </View>
        </CarouselContext.Provider>
    );
}

export function CarouselContent({ className, children, ...props }) {
    const { carouselRef, orientation, handleScroll } = useCarousel();

    return (
        <ScrollView
            ref={carouselRef}
            horizontal={orientation === "horizontal"}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            contentContainerStyle={cn(carouselStyles.content, orientation === "vertical" && { flexDirection: 'column' }, className)}
            style={carouselStyles.contentWrapper}
            {...props}
        >
            {children}
        </ScrollView>
    );
}

export function CarouselItem({ className, children, ...props }) {
    const { orientation } = useCarousel();
    
    const itemStyle = orientation === "horizontal" 
        ? { width: width, paddingLeft: 16 } // Mocking pl-4 margin in parent content
        : { height: width }; // Use width for item height in vertical carousel (for visual testing)

    return (
        <View
            role="group"
            style={cn(carouselStyles.item, itemStyle, className)}
            {...props}
        >
            {children}
        </View>
    );
}

export function CarouselPrevious({ className, ...props }) {
    const { scrollPrev, canScrollPrev, orientation } = useCarousel();
    
    const isHorizontal = orientation === "horizontal";
    const positionStyle = isHorizontal 
        ? carouselStyles.prevButton 
        : { top: 12, left: '50%', transform: [{ translateX: -16 }, { rotate: '90deg' }] };

    return (
        <TouchableOpacity
            onPress={scrollPrev}
            disabled={!canScrollPrev}
            style={cn(
                carouselStyles.button, 
                positionStyle, 
                !canScrollPrev && { opacity: 0.5 }, 
                className
            )}
            {...props}
        >
            <Feather name="arrow-left" size={16} color="#FFFFFF" />
            {/* sr-only span omitted */}
        </TouchableOpacity>
    );
}

export function CarouselNext({ className, ...props }) {
    const { scrollNext, canScrollNext, orientation } = useCarousel();

    const isHorizontal = orientation === "horizontal";
    const positionStyle = isHorizontal 
        ? carouselStyles.nextButton 
        : { bottom: 12, left: '50%', transform: [{ translateX: -16 }, { rotate: '90deg' }] };

    return (
        <TouchableOpacity
            onPress={scrollNext}
            disabled={!canScrollNext}
            style={cn(
                carouselStyles.button, 
                positionStyle, 
                !canScrollNext && { opacity: 0.5 }, 
                className
            )}
            {...props}
        >
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
            {/* sr-only span omitted */}
        </TouchableOpacity>
    );
}

export {
    Carousel,
    CarouselContent,
    CarouselItem, CarouselNext, CarouselPrevious
};
