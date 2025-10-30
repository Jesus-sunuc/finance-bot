import React, { useState } from "react";

interface DynamicFormProps {
  options?: { [key: string]: string };
  setOptions: (options: { [key: string]: string }) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  options,
  setOptions,
}) => {
  const [formValues, setFormValues] = useState<
    { [key: string]: string } | undefined
  >(options);
  const [newKey, setNewKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  const handleAddOption = () => {
    if (newKey && newValue) {
      const newOptions = { ...formValues, [newKey]: newValue };
      setOptions(newOptions);
      setFormValues(newOptions);
      setNewKey("");
      setNewValue("");
    }
  };

  const handleValueChange = (key: string, value: string) => {
    const updatedOptions = { ...formValues, [key]: value };
    setFormValues(updatedOptions);
    setOptions(updatedOptions);
  };

  return (
    <>
      {formValues &&
        Object.entries(formValues).map(([key, value]) => (
          <label className="form-label w-100" key={key}>
            {key}
            <input
              className="form-control"
              value={value}
              onChange={(e) => handleValueChange(key, e.target.value)}
            />
          </label>
        ))}
      <div className="row mb-3">
        <div className="col">
          <input
            className="form-control"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={handleAddOption}
            disabled={newKey === "" || newValue === ""}
            type="button"
          >
            Add Option
          </button>
        </div>
      </div>
    </>
  );
};
