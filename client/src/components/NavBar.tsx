import { type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export const NavBar: FC = () => {
  const auth = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    void auth.signoutRedirect();
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-blue-400 transition"
            >
              Finance Bot
            </Link>

            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive("/")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive("/about")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {auth.user?.profile.email && (
              <span className="text-sm text-gray-300">
                {auth.user.profile.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
