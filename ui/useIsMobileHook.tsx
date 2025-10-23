import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

// Mocking the web-style hook for compatibility.
// In RN, we just check Dimensions.get('window').width
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    Dimensions.get("window").width < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsMobile(window.width < MOBILE_BREAKPOINT);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription.remove();
  }, []);

  return isMobile;
}