import React from "react";
import { baseUrl } from "../constant/Url";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaExclamationTriangle, FaSearch, FaServer } from "react-icons/fa";

function CashPaid() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cashPaid"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook/cash-paid`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
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

  // Data rendering
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Cash Paid
      </h1>
      {data?.cashPaid?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.cashPaid.map((entry) => (
            <div
              key={entry._id}
              className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500 "
            >
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                {entry.name}
              </h2>
              <p className="text-gray-600">
                <strong>Amount:</strong>{" "}
                <span className="text-red-600 font-semibold">
                  ₹{entry.cash_out.toLocaleString()}
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Date:</strong>{" "}
                {new Date(entry.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-blue-600 mt-2 font-semibold">
                <strong>Status:</strong> {entry.status}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Transaction Type:</strong>{" "}
                {entry.transactionType === "cash_out" ? (
                  <span className="text-red-500 font-bold">Cash Out</span>
                ) : (
                  <span className="text-gray-500 font-bold">Other</span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">
          No cash paid records found.
        </p>
      )}
    </div>
  );
}

export default CashPaid;
