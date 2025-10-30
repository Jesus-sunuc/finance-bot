import { useState } from "react";
import type { SelectInputControl } from "./useSelectInput";

interface Props<T> {
  label: string;
  control: SelectInputControl<T>;
  inputClassName?: string;
  tabIndex?: number;
  labelClassName?: string;
}
export function SelectInput<T>({
  label,
  control,
  inputClassName,
  tabIndex = 0,
  labelClassName = "",
}: Props<T>) {
  const [hasBeenTouched, _setHasBeenTouched] = useState(false);

  const validationClasses =
    hasBeenTouched && control.error
      ? "is-invalid"
      : hasBeenTouched
      ? "is-valid"
      : "";

  const computedLabel = label.toLowerCase().replace(" ", "");
  const labelClasses = ` my-auto`;

  return (
    <div className="form-group">
      <div className={labelClasses + " "}>
        <label
          htmlFor={computedLabel}
          className={"form-label ps-1 mb-0 " + labelClassName}
        >
          {label}
        </label>
      </div>
      <div
        className={inputClassName ? `my-auto ${inputClassName}` : " my-auto"}
      >
        <select
          name={computedLabel}
          id={computedLabel}
          className={"form-select" + validationClasses}
          value={control.displayValue}
          onChange={(e) => control.setValue(e.target.value)}
          tabIndex={tabIndex}
        >
          {control.options.map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </select>
        {control.error && hasBeenTouched && (
          <div className="invalid-feedback" id={`${computedLabel}Feedback`}>
            {control.error}
          </div>
        )}
      </div>
    </div>
  );
}
