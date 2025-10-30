import { type FC } from "react";
import style from "./Spinner.module.scss";

export const Spinner: FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className={style.spinner + " " + className}></div>
    </div>
  );
};
