import { StyleSheet } from 'react-native';

// This is a placeholder for the `cn` function (tailwind class merging).
// In RN, we rely on array merging in the StyleSheet API.
// We map common conceptual colors used in the project to specific hex codes.

// Mock of common colors based on the project's existing files
const COLORS = {
  'primary': '#5C7AB8', // A strong blue/purple theme color
  'primary-foreground': '#FFFFFF',
  'secondary': '#2a2a4a', // Dark secondary background
  'secondary-foreground': '#D1D5DB', // gray-300
  'destructive': '#EF4444', // red-500
  'destructive-foreground': '#FFFFFF',
  'background': '#0a0a1a', // Main dark background
  'foreground': '#FFFFFF', // Main text color
  'muted-foreground': '#9CA3AF', // gray-400
  'card': '#1a1a2e', // A darker card background
  'card-foreground': '#FFFFFF',
  'input': '#ffffff26', // White/15 transparent for inputs
  'border': '#ffffff1a', // White/10 border
  'ring': '#7B9ED9', // Highlight color
  'accent': '#6b8fe4', // Accent blue
  'accent-foreground': '#FFFFFF',
};

// Simple utility function to combine style objects/arrays.
// It resolves Tailwind-like classes to specific RN styles.
export function cn(...styles) {
    // This highly simplifies the actual CVA/Tailwind logic to just merging RN styles.
    // We assume the input is an array of RN style objects or falsy values.
    return styles.flat().filter(s => s !== null && s !== undefined && s !== false);
}

// A helper function to generate RN styles from CVA-like variants.
// This requires manual mapping of all CVA class strings to RN style objects.
export function createVariants(baseStyles, variants) {
    return (props = {}) => {
        const { variant, size, className, ...rest } = props;
        
        let styles = [baseStyles];

        if (variant && variants.variant && variants.variant[variant]) {
            styles.push(variants.variant[variant]);
        }
        if (size && variants.size && variants.size[size]) {
            styles.push(variants.size[size]);
        }
        
        // Merge any directly passed classNames/styles
        if (className) {
            styles = styles.concat(className);
        }

        return StyleSheet.flatten(styles.filter(Boolean));
    };
}

export default { cn, createVariants };