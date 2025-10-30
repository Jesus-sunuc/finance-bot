import { useState } from "react";
import type { SelectInputControl } from "./useSelectInput";

interface Props<T> {
  label: string;
  control: SelectInputControl<T>;
  inputClassName?: string;
  tabIndex?: number;
  labelClassName?: string;
}

export function RadioInput<T>({
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
  const labelClasses = `my-auto`;

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
      <div className={inputClassName ? `my-auto ${inputClassName}` : "my-auto"}>
        {control.options.map((o) => (
          <div key={o} className="form-check">
            <label className="form-check-label">
              <input
                type="radio"
                className={`form-check-input ${validationClasses}`}
                value={o}
                checked={control.displayValue === o}
                onChange={(e) => control.setValue(e.target.value)}
                tabIndex={tabIndex}
              />
              {o}
            </label>
          </div>
        ))}
        {control.error && hasBeenTouched && (
          <div className="invalid-feedback" id={`${computedLabel}Feedback`}>
            {control.error}
          </div>
        )}
      </div>
    </div>
  );
}
