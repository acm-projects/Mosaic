import { Feather } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, TextInput, View } from "react-native";
import { cn } from "./utils";

const { width } = Dimensions.get('window');

const otpStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // gap-1
    },
    slot: {
        height: 36, // h-9
        width: 36, // w-9
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ffffff1a', // border-input
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e', // dark:bg-input/30
        fontSize: 16, // text-sm
        color: '#FFFFFF',
        textAlign: 'center',
    },
    slotActive: {
        borderColor: '#7B9ED9', // border-ring
        borderWidth: 2,
    },
    separator: {
        width: 16, // size-4 equivalent
        height: 1, // h-px
        backgroundColor: '#9CA3AF',
        marginHorizontal: 4,
    }
});

const OTPContext = React.createContext({});

export function InputOTP({ value, onChange, maxLength = 6, containerClassName, ...props }) {
    const [otpValues, setOtpValues] = useState(Array(maxLength).fill(''));
    const inputRefs = useRef(Array(maxLength).fill(null));

    // Handle full OTP input change
    const fullOtp = otpValues.join('');
    
    React.useEffect(() => {
        if (fullOtp.length === maxLength) {
            onChange && onChange(fullOtp);
            Keyboard.dismiss();
        }
    }, [fullOtp, maxLength, onChange]);

    const handleSlotChange = (text, index) => {
        const newOtp = [...otpValues];
        const newChar = text.slice(-1); // Take only the last character if pasted/typed
        newOtp[index] = newChar;
        setOtpValues(newOtp);

        // Auto focus to next input
        if (newChar && index < maxLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Auto focus back if deleted and not empty
        else if (text.length === 0 && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const contextValue = useMemo(() => ({ otpValues, handleSlotChange, inputRefs }), [otpValues, handleSlotChange]);

    return (
        <OTPContext.Provider value={contextValue}>
            <View style={cn(otpStyles.container, containerClassName)} {...props}>
                {/* Children (InputOTPGroup and Separator) will handle rendering slots */}
                {React.Children.map(props.children, child => child)}
            </View>
        </OTPContext.Provider>
    );
}

export function InputOTPGroup({ className, children, ...props }) {
    return (
        <View style={cn(otpStyles.group, className)} {...props}>
            {children}
        </View>
    );
}

export function InputOTPSlot({ index, className, ...props }) {
    const { otpValues, handleSlotChange, inputRefs } = React.useContext(OTPContext);
    const [isActive, setIsActive] = useState(false);

    return (
        <TextInput
            ref={(el) => inputRefs.current[index] = el}
            style={cn(
                otpStyles.slot,
                isActive && otpStyles.slotActive,
                className
            )}
            value={otpValues[index]}
            onChangeText={(text) => handleSlotChange(text, index)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden={!isActive}
            selectTextOnFocus={true}
            textContentType="oneTimeCode" // Enables OS auto-fill for OTP
            {...props}
        />
    );
}

export function InputOTPSeparator({ ...props }) {
    return (
        <View style={otpStyles.separator} role="separator" {...props}>
            <Feather name="minus" size={16} color="#9CA3AF" />
        </View>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
