import { useEffect } from "react";

export const useTabFocus = ({onFocus, onBlur}: {onFocus?: () => void, onBlur?: () => void}) => {


  useEffect(() => {
    const handleFocus = () => {
      if (onFocus) {
        onFocus();
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onFocus, onBlur]);
};
