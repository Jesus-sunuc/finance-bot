import { useState, useRef } from "react";
export interface SelectManyInputControl<T> {
  values: T[];
  error: string;
  options: string[];
  displayValue: string;
  addValueByKey: (val: string) => void;
  removeValueByKey: (val: string) => void;
  toggleValue: (val: string) => void;
  getKey: (val: T) => string;
  toggleAll: () => void;
  reset: () => void;
}

interface Props<T> {
  label: string;
  control: SelectManyInputControl<T>;
  inputClassName?: string;
  tabIndex?: number;
  labelClassName?: string;
}

export function SelectManyInputs<T>({
  label,
  control,
  inputClassName,
  tabIndex = -1,
  labelClassName = "",
}: Props<T>) {
  const [filter, setFilter] = useState("");
  const computedLabel = label.toLowerCase().replace(" ", "");
  const labelClasses = ` my-auto`;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = control.options.filter((o) =>
    o.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="form-group">
      <div className={labelClasses + " "}>
        <label
          htmlFor={computedLabel}
          className={"form-label ps-1 mb-0" + labelClassName}
        >
          {label}
        </label>
      </div>
      <div
        className={inputClassName ? `my-auto ${inputClassName}` : " my-auto"}
        role="button"
      >
        <div className="dropdown">
          <div
            className="form-select"
            id={`dropdownButton${computedLabel}`}
            data-bs-toggle="dropdown"
            onClick={() => searchInputRef.current?.focus()}
          >
            {control.displayValue}
          </div>
          <div
            className="dropdown-menu overflow-y-auto"
            aria-labelledby={`dropdownButton${computedLabel}`}
            tabIndex={tabIndex}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "300px" }}
          >
            <input
              ref={searchInputRef}
              className="form-control w-75 mx-auto mb-1"
              type="text"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            />
            <div className="ms-1 form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  onChange={() => control.toggleAll()}
                  type="checkbox"
                  checked={control.values.length === control.options.length}
                />
                All
              </label>
            </div>
            {filteredOptions.map((o) => (
              <div className="ms-1 form-check" key={o}>
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    onChange={() => control.toggleValue(o)}
                    type="checkbox"
                    checked={
                      !!control.values?.find((v) => control.getKey(v) === o)
                    }
                    id={o}
                    value={o}
                  />
                  {o}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
