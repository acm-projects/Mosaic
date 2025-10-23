
// Since the Sonner web library is not compatible with RN/Expo,
// this component serves as a no-op placeholder. Toast functionality
// is mocked via Alert in src/utils/Utils.js.

export const Toaster = ({ children, ...props }) => {
    // In a production RN app, you would integrate a library like 'react-native-toast-message' here.
    return null;
};

export { Toaster };
