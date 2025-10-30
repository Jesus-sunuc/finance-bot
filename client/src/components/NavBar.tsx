import { Link } from "react-router";
import { ThemeSelector } from "./theme/ThemeSelector";

export const NavBar = () => {
  return (
    <div className="bg-primary">
      <nav className="navbar navbar-expand-lg navbar-dark container">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              className="img-fluid"
              style={{ maxHeight: "40px" }}
              id="navbar-logo"
              alt="Logo"
              src="/logo.png"
            />
          </Link>
          <div className="text-white ps-2 pe-2 my-md-auto ml-auto me-2">
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </div>
  );
};
