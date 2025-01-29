import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../constant/Url";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function SpinEdit() {
  const { id } = useParams();

  const [spinForm, setSpinForm] = useState({
    category: "",
    totalAmount: "",
    users: [],
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["SpinEdit", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/spin/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  const spin = data?.spin?.[0];

  useEffect(() => {
    if (spin) {
      setSpinForm({
        category: spin.category || "",
        totalAmount: spin.totalAmount || "",
        users: spin.users || [],
      });
    }
  }, [spin]);

  const updateSpinMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.put(
        `${baseUrl}/api/spin/SpinGroup/${id}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("spin updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error updating spin: ${error.message}`);
    },
  });

  <div className="flex items-center justify-center min-h-screen  ">
    <ClipLoader color="blue" size={70} className="font-bold" />
  </div>;
  if (isError) return <p>Error loading data</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpinForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...spinForm.users];
    updatedUsers[index][field] = value;
    setSpinForm((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSpinMutation.mutate(spinForm);
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Edit Spin
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-lg font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="category"
            name="category"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Category Title"
            value={spinForm.category}
            onChange={handleChange}
          />

          <label
            htmlFor="totalAmount"
            className="block text-lg font-medium text-gray-700 mt-4"
          >
            Amount
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Expense Amount"
            value={spinForm.totalAmount}
            onChange={handleChange}
          />

          <div className="mt-4">
            <h3 className="text-xl font-bold text-indigo-700">Users</h3>
            {spinForm.users.map((user, index) => (
              <div key={user._id || index} className="mt-2">
                <label className="block text-lg font-medium text-gray-700">
                  User Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  value={user.name}
                  onChange={(e) =>
                    handleUserChange(index, "name", e.target.value)
                  }
                />
                <label
                  htmlFor="amount"
                  className="block text-lg font-medium text-gray-700 mt-4"
                >
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  value={user.amount}
                  onChange={(e) =>
                    handleUserChange(index, "amount", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mt-4"
          >
            Spin Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default SpinEdit;
