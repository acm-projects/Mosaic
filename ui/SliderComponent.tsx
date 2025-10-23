import SliderRN from '@react-native-community/slider'; // Requires installing @react-native-community/slider
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { cn } from "./utils";

const sliderStyles = StyleSheet.create({
    root: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
    },
    // We mock Radix Track/Range/Thumb styles via RN Slider props
    minimumTrackTintColor: '#5C7AB8', // bg-primary
    maximumTrackTintColor: '#5C7AB833', // bg-muted or bg-primary/20
    thumbTintColor: '#FFFFFF', // bg-background (with white border mock)
    
    // Placeholder for multiple thumb values (not fully supported by RN default slider)
    multiThumbContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    }
});

// Since the provided file supports multi-value thumbs, which RN's default slider
// does not easily handle, this is a simplified single-value wrapper.
export function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) {
  // Use the first value if an array is passed, as RN Slider is single-value
  const singleValue = useMemo(() => Array.isArray(value) ? value[0] : value, [value]);
  
  // Convert single value change back to an array if the original prop was an array
  const handleValueChange = useCallback((newValue) => {
    if (onValueChange) {
      const outputValue = Array.isArray(value) ? [newValue, ...value.slice(1)] : newValue;
      onValueChange(outputValue);
    }
  }, [onValueChange, value]);

  return (
    <View style={cn(sliderStyles.root, className)}>
      <SliderRN
        style={sliderStyles.root}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={singleValue}
        onValueChange={handleValueChange}
        minimumTrackTintColor={sliderStyles.minimumTrackTintColor}
        maximumTrackTintColor={sliderStyles.maximumTrackTintColor}
        thumbTintColor={sliderStyles.thumbTintColor}
        disabled={props.disabled}
        {...props}
      />
      {/* Note: Vertical orientation and multiple thumbs require custom PanResponder implementation in RN */}
    </View>
  );
}

// Mocking Radix primitives not used here
export const SliderTrack = View;
export const SliderRange = View;
export const SliderThumb = View;


export { Slider };
