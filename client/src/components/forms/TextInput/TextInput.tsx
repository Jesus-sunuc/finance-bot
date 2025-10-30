import { type FC, useState } from "react";

export interface TextInputControl {
  value: string;
  setValue: (i: string) => void;
  error: string;
  hasRules?: boolean;
}
interface Props {
  label: string;
  control: TextInputControl;
  inputClassName?: string;
  displayLabel?: boolean;
  isTextArea?: boolean;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
  max?: number;
  className?: string;
  defaultTouched?: boolean;
}
export const TextInput: FC<Props> = ({
  label,
  control,
  inputClassName = "",
  displayLabel = true,
  isTextArea = false,
  rows = 4,
  placeholder = "",
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
  const labelClasses = `my-auto col-auto`;

  return (
    <div className={`form-group ${className}`}>
      {displayLabel && (
        <div className={labelClasses}>
          <label htmlFor={computedLabel} className="form-label ps-1 mb-0">
            {label}
          </label>
        </div>
      )}
      <div className={`my-auto col ${inputClassName}`}>
        {isTextArea ? (
          <textarea
            name={computedLabel}
            id={computedLabel}
            value={control.value}
            className={"form-control " + validationClasses}
            onChange={(e) => control.setValue(e.target.value)}
            onBlur={() => setHasBeenTouched(!!control.hasRules)}
            rows={rows}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            name={computedLabel}
            id={computedLabel}
            value={control.value}
            className={"form-control " + validationClasses}
            onChange={(e) => control.setValue(e.target.value)}
            onBlur={() => setHasBeenTouched(!!control.hasRules)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            max={max}
          />
        )}
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
