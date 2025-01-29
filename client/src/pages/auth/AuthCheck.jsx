import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constant/Url";
import ClipLoader from "react-spinners/ClipLoader"; // Loading spinner

function AuthCheck({ children }) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/auth/profile`, {
        method: "GET",
        credentials: "include", // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      return response.json();
    },
    retry: false, // Prevents infinite retry loops
  });

  // Redirect to login if authentication fails (Runs only once)
  React.useEffect(() => {
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
