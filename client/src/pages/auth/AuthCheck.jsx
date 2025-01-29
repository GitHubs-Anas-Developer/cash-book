import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constant/Url";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function AuthCheck({ children }) {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Auth"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/authCheck`, {
        withCredentials: true,
      });
      return response.data;
    },
    retry: 1,
    staleTime: 0,
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (data===undefined || !data.user) {
      navigate("/login");
    }
  }, [data, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">
          Error: {error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (data?.user) {
    // Render child components if authenticated
    return <>{children}</>;
  }

  // Fallback when navigation is being processed
  return null;
}

export default AuthCheck;
