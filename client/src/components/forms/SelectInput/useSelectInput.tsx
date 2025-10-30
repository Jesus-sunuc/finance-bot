import { useState, useEffect, useCallback } from "react";

export interface SelectInputControl<T> {
  value?: T;
  setValue: (val?: string) => void;
  error: string;
  options: string[];
  displayValue: string;
}

export function useSelectInput<T>({
  initialValue = undefined,
  watchValue,
  options,
  getKey,
  required,
  setValueCallback,
}: {
  initialValue?: T;
  watchValue?: string;
  options: T[];
  getKey: (i: T) => string;
  required?: boolean;
  setValueCallback?: (i?: T) => void;
}): SelectInputControl<T> {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [error, setError] = useState("");
  useEffect(() => {
    const errorMessage = required && value ? "required" : "";
    setError(errorMessage);
  }, [value, required]);
  const setValueByKey = useCallback(
    (incomingKey?: string) => {
      if (incomingKey) {
        const selected = options.find((o) => getKey(o) === incomingKey);
        setValue(selected);
        if (setValueCallback) {
          setValueCallback(selected);
        }
      } else {
        setValue(undefined);
        if (setValueCallback) {
          setValueCallback(undefined);
        }
      }
    },
    [getKey, options, setValueCallback]
  );

  useEffect(() => {
    if (watchValue) {
      setValueByKey(watchValue);
    }
  }, [watchValue, setValueByKey]);
  const displayValue = value === undefined ? "" : getKey(value);
  const displayOptions = required
    ? options.map(getKey)
    : ["", ...options.map(getKey)];
  return {
    value,
    displayValue,
    setValue: setValueByKey,
    error,
    options: displayOptions,
  };
}
