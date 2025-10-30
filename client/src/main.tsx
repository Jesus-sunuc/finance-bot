import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./services/queryClient.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { LoadingAndErrorHandling } from "./components/LoadingAndErrorHandling.tsx";
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";

const queryClient = getQueryClient();

const oidcConfig: AuthProviderProps = {
  authority: "https://auth-dev.snowse.io/realms/DevRealm",
  client_id: "jesus-chat",
  redirect_uri: window.location.origin + "/",
  post_logout_redirect_uri: window.location.origin + "/",

  onSigninCallback(user) {
    console.log("User signed in:", user);
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("session_state");
    url.searchParams.delete("iss");
    window.history.replaceState(null, " ", url.toString());
  },
  onSignoutCallback() {
    console.log("User signed out");
  },

  automaticSilentRenew: true,
  loadUserInfo: true,

  scope: "openid profile email",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingAndErrorHandling>
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...oidcConfig}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LoadingAndErrorHandling>
  </StrictMode>
);
