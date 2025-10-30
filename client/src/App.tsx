import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { setAccessTokenGetter } from "./utils/axiosClient";
import { LoadingSpinner } from "./components/auth/LoadingSpinner";
import { AuthError } from "./components/auth/AuthError";
import { LoginPage } from "./components/auth/LoginPage";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";

function App() {
  const auth = useAuth();

  useEffect(() => {
    setAccessTokenGetter(() => auth.user?.access_token);
  }, [auth.user?.access_token]);

  if (auth.activeNavigator === "signinSilent") {
    return <LoadingSpinner message="Signing you in..." />;
  }

  if (auth.activeNavigator === "signoutRedirect") {
    return <LoadingSpinner message="Signing you out..." />;
  }

  if (auth.isLoading) {
    return <LoadingSpinner />;
  }

  if (auth.error) {
    return (
      <AuthError
        message={auth.error.message}
        onRetry={() => void auth.signinRedirect()}
      />
    );
  }

  if (auth.isAuthenticated) {
    console.log("User email:", auth.user?.profile.email);

    return (
      <AuthenticatedLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthenticatedLayout>
    );
  }

  return <LoginPage onSignIn={() => void auth.signinRedirect()} />;
}

export default App;
