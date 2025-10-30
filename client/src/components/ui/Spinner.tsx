import { type FC } from "react";

export const Spinner: FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="flex justify-center">
      <div
        className={`
          w-12 h-12 
          border-[3px] border-current border-t-transparent 
          rounded-full 
          animate-spin
          ${className}
        `}
      ></div>
    </div>
  );
};
