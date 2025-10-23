import React, { createContext, useContext, useId } from "react";
import {
    Controller,
    FormProvider,
    useFormContext
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { cn } from "./utils";
// Note: RN typically doesn't use a separate Label primitive; Text is sufficient.
// The existing project does not have a separate `label.tsx`.

const formStyles = StyleSheet.create({
    formItem: {
        gap: 8, // gap-2
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    labelError: {
        color: '#EF4444', // text-destructive
    },
    description: {
        fontSize: 14,
        color: '#9CA3AF', // text-muted-foreground
        marginTop: 4,
    },
    message: {
        fontSize: 14,
        color: '#EF4444', // text-destructive
        marginTop: 4,
    },
    // Mock styles for input/control to show error state
    control: {
        borderWidth: 1,
        borderColor: '#ffffff1a',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        color: '#FFFFFF',
        backgroundColor: '#1a1a2e',
    },
    controlError: {
        borderColor: '#EF4444',
    }
});

// --- Contexts ---

const FormFieldContext = createContext({});
const FormItemContext = createContext({});

// --- Hooks ---

export function useFormField() {
    const fieldContext = useContext(FormFieldContext);
    const itemContext = useContext(FormItemContext);
    const { control, getFieldState, formState } = useFormContext();
    
    // We use getFieldState and useWatch to get real-time status (error, isDirty, etc.)
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;
    const error = fieldState.error;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
        error: error,
    };
}

// --- Components ---

export const Form = FormProvider;

export function FormField({ ...props }) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function FormItem({ className, children, ...props }) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View
        style={cn(formStyles.formItem, className)}
        {...props}
      >
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

export function FormLabel({ className, children, ...props }) {
  const { error, formItemId } = useFormField();
  
  return (
    <Text
      style={cn(formStyles.label, !!error && formStyles.labelError, className)}
      accessibilityLabelledBy={formItemId}
      {...props}
    >
      {children}
    </Text>
  );
}

export function FormControl({ children, ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  
  // Slot equivalent: Inject RHF props into the single child element
  if (React.Children.count(children) !== 1) {
    console.error("FormControl expects exactly one child element.");
    return null;
  }
  
  const child = React.Children.only(children);
  
  // Inject props required by RHF Control (e.g., value, onChange, onBlur)
  // These are actually provided by the Controller in RHF, so we focus on accessibility/error state
  return React.cloneElement(child, {
    // Standard RN TextInput props for RHF integration (assuming child is TextInput or compatible)
    id: formItemId,
    accessibilityDescribedBy: !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
    accessibilityInvalid: !!error,
    style: [
        formStyles.control,
        !!error && formStyles.controlError,
        child.props.style // Preserve original styles
    ],
    // The actual value/onChange/onBlur logic is passed by Controller, not FormControl
    ...props
  });
}

export function FormDescription({ className, children, ...props }) {
  const { formDescriptionId } = useFormField();

  return (
    <Text
      id={formDescriptionId}
      style={cn(formStyles.description, className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <Text
      id={formMessageId}
      style={cn(formStyles.message, className)}
      {...props}
    >
      {body}
    </Text>
  );
}

// Mock of Label component which is usually imported separately
export const Label = (props) => <Text style={formStyles.label} {...props} />;

export {
    Form, FormControl,
    FormDescription, FormField, FormItem,
    FormLabel, FormMessage, useFormField
};
