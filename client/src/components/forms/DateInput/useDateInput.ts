import { useState, useEffect } from "react";
import { validateDate, type DateRules } from "../formValidation";
import type { DateInputControl } from "./DateInput";

export const useDateInput = (
  initialValue?: Date,
  rules?: DateRules,
  setValueCallback?: (i?: Date) => void
): DateInputControl => {
  const [value, setValue] = useState(
    initialValue ? new Date(initialValue) : undefined
  );
  const [error, setError] = useState("");
  useEffect(() => {
    setError(validateDate(value, rules));
  }, [value, setError, rules]);
  const hasRules = !!rules;
  const setValueWithCallback = (v?: Date) => {
    setValue(v);
    if (setValueCallback) setValueCallback(v);
  };
  return { value, setValue: setValueWithCallback, error, hasRules };
};
