import { type FC, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-4 py-2 bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-700"
        } rounded-lg text-gray-100 focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-primary-500"
        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default SelectInput;
