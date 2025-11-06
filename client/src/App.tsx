import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import ReceiptScanner from "./pages/ReceiptScanner";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { setAccessTokenGetter } from "./utils/axiosClient";
import { LoadingSpinner } from "./components/auth/LoadingSpinner";
import { AuthError } from "./components/auth/AuthError";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

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
    return (
      <AuthenticatedLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/scanner" element={<ReceiptScanner />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthenticatedLayout>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </PublicLayout>
  );
}

export default App;
