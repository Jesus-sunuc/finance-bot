import { useEffect } from "react";
import { useTextInput } from "../TextInput/useTextInput";
import type { DebouncedTextInputControl } from "./DebounceTextInput";

export const useDebouncedTextInput = (
  initialValue: string,
  setValueCallback?: (i: string) => void
): DebouncedTextInputControl => {
  const queryControl = useTextInput(initialValue);
  const debounceControl = useTextInput(
    initialValue,
    undefined,
    setValueCallback
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      queryControl.setValue(debounceControl.value);
    }, 500);

    return () => clearTimeout(timer);
  }, [debounceControl.value, queryControl]);

  return { queryControl, debounceControl };
};
