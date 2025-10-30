import { useState, useEffect } from "react";
import { type Rules, validateNumber } from "../formValidation";
import type { NumberInputControl } from "./NumberInput";


export const useNumberInput = (
  initialValue: number,
  rules?: Rules,
  setValueCallback?: (i: number) => void
): NumberInputControl => {
  const [value, setValue] = useState<number>(initialValue);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setError(validateNumber(value, rules));
  }, [value, setError, rules]);
  const hasRules = !!rules;
  const setValueWithCallback = (v: number) => {
    setValue(v);
    if (setValueCallback) setValueCallback(v);
  };
  return { value, setValue: setValueWithCallback, error, hasRules };
};
