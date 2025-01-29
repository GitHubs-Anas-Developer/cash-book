import React, { useEffect, useState } from "react";
import { baseUrl } from "../../constant/Url";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function CashInEdit() {
  const { id } = useParams();

  const [CashIn, setCashIn] = useState({
    name: "",
    amount: "",
    status: "",
    transactionType: "cash_in",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cash_In", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCashIn({
        name: data.name,
        amount: data.cash_in,
        status: data.status,
        transactionType: "cash_in",
      });
    }
  }, [data]);

  const updateCashIn = useMutation({
    mutationFn: async () => {
      await axios.put(`${baseUrl}/api/cashbook/${id}`, CashIn, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      alert("CashIn updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to update CashIn. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCashIn((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCashIn.mutate();
  };

  <div className="flex items-center justify-center min-h-screen  ">
    <ClipLoader color="blue" size={70} className="font-bold" />
  </div>;
  if (isError) return <p>Failed to fetch data.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Edit CashIn
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
            value={CashIn.name}
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
            value={CashIn.amount}
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
            value={CashIn.status}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="received">Received</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            disabled={updateCashIn.isLoading}
          >
            {updateCashIn.isLoading ? "Updating..." : "CashIn Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CashInEdit;
