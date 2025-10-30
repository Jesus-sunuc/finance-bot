import { type FC, type ReactNode } from "react";
import { NavBar } from "../NavBar";
import { Toaster } from "react-hot-toast";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </>
  );
};
