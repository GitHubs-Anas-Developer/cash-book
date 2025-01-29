import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query"; // Import useMutation from react-query
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/Url";


function SpinAddUser() {
  const { id } = useParams();
  const [userForm, setUserForm] = useState({
    name: "",
    amount: "",
  });

  // Use useMutation for the form submission
  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: async (newExpense) => {
      const response = await axios.post(
        `${baseUrl}/api/spin/single/participants/add/${id}`,
        newExpense,
        {
          withCredentials: true, // If you need cookies/session for authentication
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("User added successfully!");
    },
    onError: (error) => {
      toast.error("Error adding user: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh on form submit

    // Check if both fields are filled
    if (!userForm.name || !userForm.amount) {
      alert("Please fill out both fields.");
      return;
    }

    // Call mutate to submit the data
    mutate(userForm);

    // Optionally, clear the form after submission
    setUserForm({
      name: "",
      amount: "",
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Add User
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-lg font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            value={userForm.name}
            onChange={handleChange}
            placeholder="Enter name"
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
            value={userForm.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          disabled={isLoading} // Disable the button if the mutation is in progress
        >
          {isLoading ? "Adding..." : "Add Expense"}
        </button>

        {isError && (
          <div className="mt-4 text-red-500 text-center">
            Error: {error.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default SpinAddUser;
