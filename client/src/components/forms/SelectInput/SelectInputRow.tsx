import { type ReactNode, useState } from "react";
import type { SelectInputControl } from "./useSelectInput";


interface Props<T> {
  label: string;
  control: SelectInputControl<T>;
  tabIndex?: number;
  className?: string;
  helpText?: string | ReactNode;
  labelClassName?: string;
}
export function SelectInputRow<T>({
  label,
  control,
  tabIndex = 0,
  className = "mb-3",
  helpText,
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
  return (
    <div className={`${className}`}>
      {helpText && <div className="form-text text-wrap">{helpText}</div>}
      <div className="row">
        <label
          htmlFor={computedLabel}
          className={"col form-label my-auto " + labelClassName}
        >
          {label}
          {!label.endsWith("?") && ""}
        </label>
        <div className="col-auto">
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
    </div>
  );
}
