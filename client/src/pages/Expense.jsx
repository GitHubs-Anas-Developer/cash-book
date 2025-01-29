import React from "react";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function Expense() {
  const { id } = useParams(); // Get the expense ID from the URL
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/expense/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (expenseId) => {
      await axios.delete(`${baseUrl}/api/expense/expenses/${expenseId}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully.");
      queryClient.invalidateQueries(["expense", id]); // Refetch specific expense
    },
    onError: (error) => {
      toast.error("Error deleting expense: " + error.response?.data?.message);
    },
  });

  const handleDelete = (expenseId) => {
    deleteMutation.mutate(expenseId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
        <ClipLoader color="blue" size={70} className="font-bold" />
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error?.response?.data?.message ||
      "Something went wrong while fetching the expense.";
    return (
      <div className="text-center text-lg text-red-600 py-10">
        Error: {errorMessage}
      </div>
    );
  }

  const expenses = data?.expense?.expenses || [];

  return (
    <div className="max-w-5xl mx-auto p-4  to-blue-50 rounded-xl  mt-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-indigo-900">Expense Details</h2>

        <Link
          to={`/expenses/add/${data?.expense._id}`}
          className="inline-block bg-gradient-to-r from-teal-400 to-green-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-teal-500 hover:to-green-600 transform hover:scale-105 transition duration-300 ease-in-out mt-8"
        >
          Add Expense
        </Link>

        <p className="text-xl text-gray-600 mt-4">
          {data?.expense?.category || "Category Not Available"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Created on:</strong>{" "}
          {new Date(data?.expense?.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.length === 0 ? (
          <p className="text-center text-lg text-gray-700 py-10 col-span-full">
            No expenses found.
          </p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-indigo-700">
                  {expense.title}
                </h3>
                <p className="text-lg text-red-600 font-bold mt-2">
                  ₹{expense.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Created on:</strong>{" "}
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/expense/view/edit/${expense._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition ease-in-out duration-300 flex items-center"
                >
                  <FaEdit size={18} />
                </Link>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none transition ease-in-out duration-300 flex items-center"
                  onClick={() => handleDelete(expense._id)}
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Expense;
