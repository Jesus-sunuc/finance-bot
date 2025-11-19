import { type FC, type ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen">{children}</div>
    </>
  );
};
