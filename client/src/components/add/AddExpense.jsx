import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/Url";

function AddExpense() {
  const { id } = useParams(); // Get any parameter from URL, such as category ID
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  // Mutation to add expense
  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: async (newExpense) => {
      const response = await axios.post(
        `${baseUrl}/api/expense/expenses/add/${id}`,
        newExpense,
        {
          withCredentials: true, // If you need cookies/session for authentication
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
    },
    onError: (error) => {
      toast.error("Error adding expense: " + error.message);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the mutate function with the expense data
    mutate(expense);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl  mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Expense Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            value={expense.title}
            onChange={handleChange}
            placeholder="Enter expense title"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-lg font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            value={expense.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {isError && (
        <div className="mt-4 text-red-600">
          Error: {error?.message || "Something went wrong"}
        </div>
      )}
      {isSuccess && (
        <div className="mt-4 text-green-600">Expense added successfully!</div>
      )}
    </div>
  );
}

export default AddExpense;
