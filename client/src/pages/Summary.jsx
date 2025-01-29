import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../constant/Url";
import { ClipLoader } from "react-spinners";
import { FaExclamationTriangle, FaServer, FaSearch } from "react-icons/fa"; // Importing additional icons

function Summary() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cashbook_summary"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook/summary`, {
        withCredentials: "include",
      });
      return response.data;
    },
    retryOnMount: false,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="blue" size={70} className="font-bold" />
      </div>
    );
  }

  // Error state
  if (isError) {
    // Check if the error is a network error or a server error
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred. Please try again later.";
    const statusCode = error?.response?.status;

    let errorIcon = <FaExclamationTriangle size={50} />; // Default error icon

    // Set the icon based on the error code
    if (statusCode === 404) {
      errorIcon = <FaSearch size={50} />;
    } else if (statusCode === 500) {
      errorIcon = <FaServer size={50} />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen text-center flex-col">
        <div className="mb-4">
          {errorIcon} {/* Centering the icon */}
        </div>
        <p>
          {/* Display specific messages for known error codes or a generic message */}
          {statusCode === 404
            ? errorMessage
            : statusCode === 500
            ? "Server error. Please try again later."
            : errorMessage}
        </p>
      </div>
    );
  }

  // Destructure data safely
  const { totalCashIn, totalCashOut, balance, totalEntries } = data || {};

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-green-100 border-l-4 border-green-500 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700">
            Total Cash In
          </h2>
          <p className="text-2xl font-bold text-green-900">
            ₹{totalCashIn ? totalCashIn.toLocaleString() : 0}
          </p>
        </div>

        <div className="p-6 bg-red-100 border-l-4 border-red-500 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700">Total Cash Out</h2>
          <p className="text-2xl font-bold text-red-900">
            ₹{totalCashOut ? totalCashOut.toLocaleString() : 0}
          </p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Net Balance</h2>
        <p className="text-2xl font-bold text-blue-900">
          ₹{balance ? balance.toLocaleString() : 0}
        </p>
      </div>

      <div className="mt-6 p-6 bg-purple-100 border-l-4 border-purple-500 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-700">Total Entries</h2>
        <p className="text-2xl font-bold text-purple-900">
          {totalEntries ? totalEntries.toLocaleString() : 0}
        </p>
      </div>
    </div>
  );
}

export default Summary;
