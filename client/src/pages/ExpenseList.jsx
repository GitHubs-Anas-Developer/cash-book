import React from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../constant/Url";
import {
  FaEdit,
  FaExclamationTriangle,
  FaSearch,
  FaServer,
  FaTrashAlt,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function ExpenseList() {
  const queryClient = new QueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expense_list"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/expense`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${baseUrl}/api/expense/${id}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      // Refetch the data after deletion
      queryClient.invalidateQueries(["expense_list"]);
    },
    onError: (error) => {
      toast.error("Error deleting expense: " + error.message);
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
        <Link
          to={"/create-expense"}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
        >
          Create Expense
        </Link>
        <div className="flex justify-center mt-8 mb-5"></div>
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
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Expense List
      </h2>

      <div className="flex justify-center mt-8 mb-5">
        <Link
          to={"/create-expense"}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
        >
          Create Expense
        </Link>
      </div>

      {data?.expenses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.expenses.map((expense) => (
            <div
              key={expense._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold text-indigo-600">
                  {expense.category}
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Date:{" "}
                {new Date(expense.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-700">
                  Total Amount:
                </h4>
                <p className="text-xl font-bold text-gray-800">
                  ₹
                  {expense.expenses
                    ?.reduce((total, item) => total + (item.amount || 0), 0)
                    .toLocaleString("en-IN") || "0"}
                </p>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <Link
                  to={`/expense/view/${expense._id}`}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  aria-label="View Details"
                >
                  View Details
                </Link>
                <div className="flex space-x-2">
                  <button
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => deleteMutation.mutate(expense._id)}
                    aria-label="Delete Expense"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500 py-6">
          No expenses found.
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
