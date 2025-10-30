import { useEffect, type FC } from "react";
import { TextInput, type TextInputControl } from "../TextInput/TextInput";

export interface DebouncedTextInputControl {
  queryControl: TextInputControl;
  debounceControl: TextInputControl;
}

interface Props {
  label: string;
  control: DebouncedTextInputControl;
  autoFocus?: boolean;
  placeholder?: string;
}

export const DebounceTextInput: FC<Props> = ({
  label,
  control,
  autoFocus = false,
  placeholder = "",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      control.queryControl.setValue(control.debounceControl.value);
    }, 500);

    return () => clearTimeout(timer);
  }, [control]);

  return (
    <div>
      <TextInput
        label={label}
        control={control.debounceControl}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    </div>
  );
};
