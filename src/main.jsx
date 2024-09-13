// index.js
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import LoginPage from "./LoginPage";
import UserMenu from "./UserMenu";
import ChatPage from "./ChatPage";
import { auth } from "./Firebase"; // تأكد من استيراد المصادقة من Firebase
import "./index.css";

const ProtectedRoute = ({ element, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-[100vh] font-normal text-[#008169] align-middle justify-center items-center">
        <h1>Loading...</h1>
      </div>
    ); 
  }
  return isAuthenticated ? element : <Navigate to="/" />;
};

const PublicRoute = ({ element, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return !isAuthenticated ? element : <Navigate to="/main" />;
};

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<PublicRoute element={<LoginPage />} />} />
      <Route path="/main" element={<ProtectedRoute element={<App />} />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
