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
                  <div className="p-3">{getErrorMessage(props.error)}</div>
                  <button
                    className="btn btn-outline-secondary"
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
