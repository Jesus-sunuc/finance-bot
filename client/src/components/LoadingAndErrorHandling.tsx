import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type FC, type ReactNode } from "react";
import { getErrorMessage } from "../services/queryClient";
import { Spinner } from "./ui/Spinner";
import { ErrorBoundary } from "react-error-boundary";

export const LoadingAndErrorHandling: FC<{
  children: ReactNode;
  errorDisplay?: ReactNode;
  fallback?: ReactNode;
}> = ({ children, errorDisplay, fallback = <Spinner /> }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) => (
            <>
              {errorDisplay ? (
                <div className="text-center">{errorDisplay}</div>
              ) : (
                <div className="text-center">
                  <div className="p-3 text-red-600 dark:text-red-400">
                    {getErrorMessage(props.error)}
                  </div>
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => props.resetErrorBoundary()}
                  >
                    Try again
                  </button>
                </div>
              )}
            </>
          )}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
