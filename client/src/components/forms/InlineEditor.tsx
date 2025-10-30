import { type FC, useState } from "react";
import { useTextInput } from "./TextInput/useTextInput";
import { TextInput } from "./TextInput/TextInput";

export const InlineEditor: FC<{
  initialValue: string;
  saveHandler: (name: string) => void;
  labelClassName?: string;
}> = ({ initialValue, saveHandler, labelClassName = "col-auto" }) => {
  const [editing, setEditing] = useState(false);
  const nameControl = useTextInput(initialValue);

  const clickHandler = async () => {
    saveHandler(nameControl.value);
    setEditing(false);
  };

  if (editing)
    return (
      <div className="row">
        <div className="col-xl-4 col-auto">
          <TextInput control={nameControl} label="Edit Name" />
        </div>
        <div className="col-auto mt-auto">
          <button
            className="btn btn-outline-secondary"
            aria-label="cancel name edit"
            type="button"
            onClick={() => setEditing(false)}
          >
            <i className="bi-x-lg" />
          </button>
        </div>
        <div className="col-auto mt-auto">
          <button
            className="btn btn-outline-success"
            aria-label="save name edit"
            type="button"
            onClick={clickHandler}
          >
            <i className="bi-check-lg" />
          </button>
        </div>
      </div>
    );

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className={`my-auto ${labelClassName}`}>
        <div>{initialValue}</div>
      </div>
      <button
        className="btn btn-outline-secondary"
        aria-label="edit name"
        type="button"
        onClick={() => setEditing(true)}
      >
        <i className="bi-pencil" />
      </button>
    </div>
  );
};
