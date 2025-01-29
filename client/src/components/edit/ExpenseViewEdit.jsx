import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "./../../constant/Url";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function ExpenseViewEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
  });

  // Fetch expense data using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["expense-view", id],
    queryFn: async () => {
      const response = await axios.get(
        `${baseUrl}/api/expense/expenses/single/view/${id}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.expensesOne) {
      setFormData({
        title: data.expensesOne.title || "",
        amount: data?.expensesOne.amount || "",
      });
    }
  }, [data]);

  // Mutation to update expense
  const updateExpenseMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${baseUrl}/api/expense/expenses/${id}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Expense updated successfully!");
      navigate(`/expense-list`); // Navigate to the expenses list
    },
    onError: (error) => {
      toast.error(`Error updating expense: ${error.message}`);
    },
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateExpenseMutation.mutate(formData);
  };

  <div className="flex items-center justify-center min-h-screen  ">
    <ClipLoader color="blue" size={70} className="font-bold" />
  </div>;

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Main content
  return (
    <div className="max-w-lg mx-auto p-6 rounded-xl shadow-md mt-10 ">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Edit Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
          />

          <label
            htmlFor="amount"
            className="block text-lg font-medium text-gray-700 mt-4"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Expense Amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          disabled={updateExpenseMutation.isLoading}
        >
          {updateExpenseMutation.isLoading ? "Updating..." : "Update Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseViewEdit;
