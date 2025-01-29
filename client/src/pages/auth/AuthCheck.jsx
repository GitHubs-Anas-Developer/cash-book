import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../../constant/Url";
import ClipLoader from "react-spinners/ClipLoader"; // Import spinner

function AuthCheck({ children }) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/auth/profile`, {
        withCredentials: true, // Ensures cookies (JWT) are sent with the request
      });
      return response.data;
    },
    retry: false, // Prevents infinite retry loops for authentication errors
  });

  // Redirect to login if authentication fails
  useEffect(() => {
    if (isError) {
      navigate("/login"); // Redirect only when error occurs
    }
  }, [isError, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="blue" size={50} />
      </div>
    );
  }

  // Render protected content only if authenticated
  return data ? children : null;
}

export default AuthCheck;
