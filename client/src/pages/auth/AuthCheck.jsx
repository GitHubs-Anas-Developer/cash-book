import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../constant/Url";
import ClipLoader from "react-spinners/ClipLoader"; // Loading spinner

function AuthCheck({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` = loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/auth/profile`, {
          withCredentials: "include", // Ensures cookies (JWT) are sent
        });
        setIsAuthenticated(true); // User is authenticated
      } catch (error) {
        console.error(
          "Auth Error:",
          error.response?.data?.message || "Authentication failed"
        );
        setIsAuthenticated(false); // Authentication failed
        navigate("/login"); // Redirect to login page
      }
    };

    checkAuth(); // Fetch authentication only once when component mounts
  }, [navigate]);

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="blue" size={50} />
      </div>
    );
  }

  // Render protected content only if authenticated
  return isAuthenticated ? children : null;
}

export default AuthCheck;
