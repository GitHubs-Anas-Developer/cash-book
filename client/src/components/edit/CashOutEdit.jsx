import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../constant/Url";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function CashOutEdit() {
  const { id } = useParams();

  const [CashOut, setCashOut] = useState({
    name: "",
    amount: "",
    status: "",
    transactionType: "cash_out",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cash_Out", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCashOut({
        name: data.name,
        amount: data.cash_out,
        status: data.status,
        transactionType: "cash_out",
      });
    }
  }, [data]);

  const updateCashOut = useMutation({
    mutationFn: async () => {
      await axios.put(`${baseUrl}/api/cashbook/${id}`, CashOut, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      alert("CashOut updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to update CashOut. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCashOut((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCashOut.mutate();
  };

  <div className="flex items-center justify-center min-h-screen  ">
    <ClipLoader color="blue" size={70} className="font-bold" />
  </div>;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-500">
          Error fetching cash-out data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Edit CashOut
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
            value={CashOut.name}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
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
            value={CashOut.amount}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Expense Amount"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-lg font-medium text-gray-700"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            value={CashOut.status}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            disabled={updateCashOut.isLoading}
          >
            {updateCashOut.isLoading ? "Updating..." : "CashOut Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CashOutEdit;
