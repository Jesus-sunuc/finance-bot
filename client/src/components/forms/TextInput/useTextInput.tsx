import { useState, useEffect } from "react";
import { type Rules, validate } from "../formValidation";
import type { TextInputControl } from "./TextInput";


export const useTextInput = (
  initialValue: string,
  rules?: Rules,
  setValueCallback?: (i: string) => void
): TextInputControl => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setError(validate(value, rules));
  }, [value, setError, rules]);
  const hasRules = !!rules;
  const setValueWithCallback = (v: string) => {
    setValue(v);
    if (setValueCallback) setValueCallback(v);
  };
  return { value, setValue: setValueWithCallback, error, hasRules };
};
