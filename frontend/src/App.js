import React from "react";
import { RouterConfig } from "./pages/RouteConfig";
import { AuthProvider } from "./services/AuthService";
import { BrowserRouter as Router } from "react-router-dom";

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <RouterConfig />
      </AuthProvider>
    </Router>
  );
}