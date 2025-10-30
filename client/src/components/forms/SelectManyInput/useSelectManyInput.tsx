import { useState, useEffect } from "react";
import type { SelectManyInputControl } from "./SelectManyInput";

export function useSelectManyInput<T>({
  initialValue = [],
  options,
  getKey,
  setValueCallback,
}: {
  initialValue?: T[];
  options: T[];
  getKey: (i: T) => string;
  setValueCallback?: (i?: T[]) => void;
}): SelectManyInputControl<T> {
  const uniqueInitialValues = initialValue.filter(
    (item, index, self) =>
      index === self.findIndex((t) => getKey(t) === getKey(item))
  );

  const [values, setValues] = useState<T[]>(uniqueInitialValues);
  const [error, setError] = useState("");

  useEffect(() => {
    const errorMessage = values ? "required" : "";
    setError(errorMessage);
  }, [values]);

  const addValueByKey = (incomingKey: string) => {
    const selected = options.find((o) => getKey(o) === incomingKey);
    if (selected) {
      setValues((v) => {
        if (v.some((item) => getKey(item) === incomingKey)) {
          return v;
        }

        const newValues = [...v, selected];
        if (setValueCallback) {
          setValueCallback(newValues);
        }
        return newValues;
      });
    }
  };

  const removeValueByKey = (incomingKey: string) => {
    setValues((v) => {
      const newValues = v.filter((o) => getKey(o) !== incomingKey);
      if (setValueCallback) {
        setValueCallback(newValues);
      }
      return newValues;
    });
  };

  const reset = () => {
    setValues([]);
    if (setValueCallback) {
      setValueCallback([]);
    }
  };

  const toggleValue = (value: string) => {
    setValues((v) => {
      if (v.some((item) => getKey(item) === value)) {
        const newValues = v.filter((o) => getKey(o) !== value);
        if (setValueCallback) {
          setValueCallback(newValues);
        }
        return newValues;
      } else {
        const newOption = options.find((o) => getKey(o) === value);
        if (newOption) {
          const newValues = [...v, newOption];
          if (setValueCallback) {
            setValueCallback(newValues);
          }
          return newValues;
        }
        return v;
      }
    });
  };

  const toggleAll = () => {
    if (values.length === options.length) {
      setValues(() => {
        if (setValueCallback) {
          setValueCallback([]);
        }
        return [];
      });
    } else {
      setValues(() => {
        const newValues = [...options];
        if (setValueCallback) {
          setValueCallback(newValues);
        }
        return newValues;
      });
    }
  };

  const displayValue = values.length
    ? `${values.length === options.length ? "All " : ""}${
        values.length
      } selected`
    : "Click to select";

  const displayOptions = options.map(getKey);
  return {
    values,
    displayValue,
    error,
    options: displayOptions,
    addValueByKey,
    removeValueByKey,
    toggleValue,
    getKey,
    toggleAll,
    reset
  };
}
