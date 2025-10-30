import { type FC } from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};
