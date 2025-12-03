import { type FC, type InputHTMLAttributes } from "react";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
}

const NumberInput: FC<NumberInputProps> = ({
  label,
  error,
  helperText,
  prefix,
  suffix,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

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
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="number"
          className={`w-full ${prefix ? "pl-8" : "pl-4"} ${
            suffix ? "pr-12" : "pr-4"
          } py-2 bg-gray-800 border ${
            error ? "border-red-500" : "border-gray-700"
          } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-primary-500"
          } disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default NumberInput;
