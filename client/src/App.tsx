import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { Toaster } from "react-hot-toast";
import { NavBar } from "./components/NavBar";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { setAccessTokenGetter } from "./utils/axiosClient";

function App() {
  const auth = useAuth();

  useEffect(() => {
    setAccessTokenGetter(() => auth.user?.access_token);
  }, [auth.user?.access_token]);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    console.log("User email:", auth.user?.profile.email);

    return (
      <>
        <Toaster />
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to AI Chat</h1>
        <p className="mb-4">Please log in to continue</p>
        <button
          onClick={() => void auth.signinRedirect()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default App;
