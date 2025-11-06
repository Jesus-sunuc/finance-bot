import { type FC, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
};
