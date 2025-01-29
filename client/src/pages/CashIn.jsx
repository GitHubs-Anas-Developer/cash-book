import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import {
  FaEdit,
  FaExclamationTriangle,
  FaSearch,
  FaServer,
  FaTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function CashIn() {
  const queryClient = new QueryClient();

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["cash_In"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook/cash-in`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  const deleteCashIn = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${baseUrl}/api/cashbook/${id}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("CashIn deleted successfully!");
      queryClient.invalidateQueries(["cash_In"]);
    },
    onError: () => {
      toast.error("Failed to delete CashIn. Please try again.");
    },
  });

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
        Cash In Details
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.cashIn.map((entry) => (
          <div
            key={entry._id}
            className="p-4 bg-green-100 rounded-lg shadow-md border-l-4 border-green-500"
          >
            <h2 className="text-lg font-semibold text-green-700">
              {entry.name}
            </h2>
            <p className="mt-2 text-gray-800">
              <strong>Amount:</strong> ₹{entry.cash_in.toLocaleString()}
            </p>
            <p className="mt-2 text-gray-800">
              <strong>Status:</strong> {entry.status}
            </p>
            <p className="mt-2 text-gray-800">
              <strong>Type:</strong>{" "}
              {entry.transactionType === "cash_in"
                ? "Cash In"
                : entry.transactionType === "cash_out"
                ? "Cash Out"
                : "Unknown"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              <strong>Date:</strong>{" "}
              {new Date(entry.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            {/* Edit and Delete Buttons */}
            <div className="mt-4 flex justify-between space-x-2">
              <Link
                to={`/cash-in/edit/${entry._id}`}
                className="bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
              >
                <FaEdit className="" />
              </Link>
              <button
                onClick={() => deleteCashIn.mutate(entry._id)}
                className="bg-red-500 text-white p-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
              >
                <FaTrashAlt className="" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CashIn;
