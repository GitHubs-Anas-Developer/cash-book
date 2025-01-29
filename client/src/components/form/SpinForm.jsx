import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "../../constant/Url";
import toast from "react-hot-toast";

function SpinForm() {
  const [spinForm, setSpinForm] = useState({
    category: "",
    totalAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpinForm({ ...spinForm, [name]: value });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${baseUrl}/api/spin/create`,
        spinForm,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Form submitted successfully!");
      setSpinForm({ category: "", totalAmount: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate();
  };
  return (
    <div className="max-w-lg mx-auto p-4 rounded-lg ">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        New Spin Group
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Enter a Category"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            value={spinForm.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="totalAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Total Amount
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            placeholder="Enter Total Amount"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            value={spinForm.totalAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              isLoading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SpinForm;
