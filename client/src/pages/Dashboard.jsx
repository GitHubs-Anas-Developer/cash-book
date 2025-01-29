import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { baseUrl } from "../constant/Url";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Fetch cashbook data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cashbook"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/cashbook`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  // Loading state
  if (isLoading) {
    return (
       <div className="flex items-center justify-center min-h-screen  ">
           <ClipLoader color="blue" size={70} className="font-bold" />
         </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p className="text-red-500 text-lg">
          Error:{" "}
          {error?.response?.data?.message ||
            error.message ||
            "An error occurred."}
        </p>
      </div>
    );
  }

  // Handle navigation
  const handleChange = (option) => {
    if (option) {
      navigate("/create-cashbook", {
        state: { option },
      });
    }
  };

  return (
    <div className="  sm:p-12">
      <div className="max-w-6xl mx-auto  p-6 sm:p-10 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-full shadow-xl hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 transition-all duration-300 w-full sm:w-auto"
              onClick={() => handleChange("cash_in")}
            >
              Cash In
            </button>
            <button
              className="bg-gradient-to-r from-red-400 to-red-600 text-white py-3 px-6 rounded-full shadow-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700 transition-all duration-300 w-full sm:w-auto"
              onClick={() => handleChange("cash_out")}
            >
              Cash Out
            </button>
          </div>
        </div>

        {/* Cashbook Entries Section */}
        <h2 className="text-xl sm:text-3xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center">
          Cashbook Entries
        </h2>

        {/* Display cashbook entries */}
        {data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                <div className="space-y-4">
                  <p
                    className={`text-lg sm:text-xl font-extrabold ${
                      item.transactionType === "cash_in"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      item.transactionType === "cash_in"
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    Amount: ₹
                    {item.cash_in > 0
                      ? item.cash_in.toLocaleString()
                      : item.cash_out.toLocaleString()}
                  </p>

                  <p className="text-sm sm:text-base text-gray-500">
                    Status:{" "}
                    <span
                      className={`${
                        item.status === "pending"
                          ? "text-yellow-500 font-extrabold"
                          : item.status === "paid"
                          ? "text-green-500 font-extrabold"
                          : item.status === "received"
                          ? "text-blue-500 font-extrabold"
                          : "text-red-500 font-extrabold"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>

                  <p
                    className={`text-sm sm:text-base font-semibold ${
                      item.transactionType === "cash_in"
                        ? "text-green-700  font-bold"
                        : "text-red-700  font-bold"
                    }`}
                  >
                    Type:{" "}
                    {item.transactionType === "cash_in"
                      ? "Cash In"
                      : "Cash Out"}
                  </p>

                  <p
                    className={`text-sm sm:text-base ${
                      item.transactionType === "cash_in"
                        ? "text-green-500  font-bold"
                        : "text-red-500  font-bold"
                    }`}
                  >
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  {/* If you want a background color that also changes based on the transaction type */}
                  <div
                    className={`p-4 rounded-lg ${
                      item.transactionType === "cash_in"
                        ? "bg-green-100 border-green-500  font-bold"
                        : "bg-red-100 border-red-500  font-bold"
                    }`}
                  >
                    {/* You can put any additional content here if needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-6">
            No cashbook entries available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
