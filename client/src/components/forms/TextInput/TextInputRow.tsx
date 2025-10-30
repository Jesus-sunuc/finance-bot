import { type FC, useState } from "react";

export interface TextInputControl {
  value: string;
  setValue: (i: string) => void;
  error: string;
  hasRules?: boolean;
}
interface Props {
  label?: string;
  control: TextInputControl;
  labelClassName?: string;
  inputClassName?: string;
  displayLabel?: boolean;
  isTextArea?: boolean;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
}
export const TextInputRow: FC<Props> = ({
  label,
  control,
  labelClassName = "col-2",
  inputClassName,
  displayLabel = true,
  isTextArea = false,
  rows = 4,
  placeholder = "",
  autoFocus = false,
}) => {
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validationClasses =
    hasBeenTouched && control.error
      ? "is-invalid"
      : hasBeenTouched
        ? "is-valid"
        : "";

  const computedLabel = label?.toLowerCase().replace(" ", "");
  const labelClasses = `${labelClassName} text-end my-auto`;

  return (
    <div className="form-group row">
      {displayLabel && (
        <div className={labelClasses}>
          <label htmlFor={computedLabel} className="col-form-label">
            {label}:
          </label>
        </div>
      )}
      <div
        className={
          inputClassName ? `my-auto ${inputClassName}` : "col-md my-auto"
        }
      >
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

