import { type FC } from "react";

export const CheckboxInput: FC<{
  checked: boolean;
  onChangeHandler: (c: boolean) => void;
  label: string;
  inputClassName?: string;
  useSwitch?: boolean;
}> = ({
  checked,
  onChangeHandler,
  label,
  inputClassName,
  useSwitch = false,
}) => {
  return (
    <div
      className={`form-check ${
        useSwitch && "form-switch"
      } d-flex align-items-start`}
    >
      <label className="form-check-label ms-2">
        <input
          type="checkbox"
          className={`form-check-input ${inputClassName}`}
          checked={checked}
          onChange={() => onChangeHandler(!checked)}
        />
        {label}
      </label>
    </div>
  );
};
