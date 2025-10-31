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
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Transaction Failed
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {getErrorMessage(props.error)}
                    </p>

                    <button
                      onClick={() => props.resetErrorBoundary()}
                      className="w-full py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
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
