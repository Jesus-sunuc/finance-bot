import { useState, type FC } from "react";
import { FormatDatetimeLocalInput } from "../../../utils/dateConverter";

export interface DateInputControl {
  value?: Date;
  setValue: (i?: Date) => void;
  error: string;
  hasRules?: boolean;
}
interface Props {
  label: string;
  control: DateInputControl;
  defaultTouched?: boolean;
  dateOnly?: boolean;
  className?: string;
}
export const DateInput: FC<Props> = ({
  label,
  control,
  defaultTouched = false,
  dateOnly = false,
  className = "",
}) => {
  const [hasBeenTouched, setHasBeenTouched] = useState(defaultTouched);

  const validationClasses =
    hasBeenTouched && control.error
      ? "is-invalid"
      : hasBeenTouched && control.value
      ? "is-valid"
      : "";

  if (dateOnly)
    return (
      <div className={className}>
        <label className="form-label">
          {label}
          <input
            type="date"
            className={"form-control " + validationClasses}
            onChange={(e) => control.setValue(new Date(e.target.value))}
            value={control.value?.toISOString().split("T")[0] ?? ""}
            onBlur={() => setHasBeenTouched(!!control.hasRules)}
          />
        </label>
        {control.error && hasBeenTouched && (
          <div v-if="" className="invalid-feedback">
            {control.error}
          </div>
        )}
      </div>
    );

  return (
    <div className={className}>
      <label className="form-label">
        {label}
        <input
          type="datetime-local"
          className={"form-control " + validationClasses}
          value={FormatDatetimeLocalInput(control.value)}
          onChange={(e) => control.setValue(new Date(e.target.value))}
          onBlur={() => setHasBeenTouched(!!control.hasRules)}
        />
      </label>
      {control.error && hasBeenTouched && (
        <div v-if="" className="invalid-feedback">
          {control.error}
        </div>
      )}
    </div>
  );
};
