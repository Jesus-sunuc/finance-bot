import { type FC, useState } from "react";

export interface NumberInputControl {
  value: number;
  setValue: (i: number) => void;
  error: string;
  hasRules?: boolean;
}
interface Props {
  label: string;
  control: NumberInputControl;
  inputClassName?: string;
  displayLabel?: boolean;
  autoFocus?: boolean;
  max?: number;
  className?: string;
  defaultTouched?: boolean;
}
export const NumberInput: FC<Props> = ({
  label,
  control,
  inputClassName,
  displayLabel = true,
  autoFocus = false,
  max,
  className = "",
  defaultTouched = false,
}) => {
  const salt = Math.random();
  const [hasBeenTouched, setHasBeenTouched] = useState(defaultTouched);

  const validationClasses =
    hasBeenTouched && control.error
      ? "is-invalid"
      : hasBeenTouched && control.value
      ? "is-valid"
      : "";

  const computedLabel = label.toLowerCase().replace(" ", "") + salt;
  const labelClasses = `my-auto`;

  return (
    <div className={`form-group ${className}`}>
      {displayLabel && (
        <div className={labelClasses}>
          <label htmlFor={computedLabel} className="form-label ps-1 mb-0">
            {label}
          </label>
        </div>
      )}
      <div className={inputClassName ? `my-auto ${inputClassName}` : "my-auto"}>
        <input
          type="number"
          name={computedLabel}
          id={computedLabel}
          value={control.value}
          className={"form-control " + validationClasses}
          onChange={(e) => control.setValue(Number(e.target.value))}
          onBlur={() => setHasBeenTouched(!!control.hasRules)}
          autoFocus={autoFocus}
          max={max}
        />
        {control.error && hasBeenTouched && (
          <div
            v-if=""
            className="invalid-feedback"
            id={`${computedLabel}Feedback`}
          >
            {control.error}
          </div>
        )}
      </div>
    </div>
  );
};
