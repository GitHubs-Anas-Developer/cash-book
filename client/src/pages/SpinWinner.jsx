import React from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

function SpinWinner() {
  const { id } = useParams();

  // Fetch winner data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Spin-winner", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/spin/winner/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
      <ClipLoader color="blue" size={70} className="font-bold" />
    </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <div className="text-xl font-semibold">
          Error loading winner data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-400">
      {/* Modal Background */}
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        {/* Fading Modal */}
        <div className="bg-white p-12 rounded-xl shadow-2xl transition-all transform opacity-100 scale-95 animate__animated animate__fadeIn animate__faster w-full max-w-lg">
          <h1 className="text-4xl font-semibold text-center mb-6 text-green-600">
            🎉 Congratulations!
          </h1>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-lg mb-8 shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out">
            <p className="text-lg font-semibold text-center">The Winner is:</p>
            <p className="text-4xl font-extrabold text-center text-yellow-300 shadow-lg p-2 rounded-lg">
              {data.winnerUser.name}
            </p>
            <p className="text-3xl font-bold text-center mt-4 text-white">
              Prize Amount: ₹{data.totalAmount.toLocaleString()}
            </p>
          </div>

          {/* Close Button with Hover Bounce */}
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpinWinner;
