import React from "react";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaExclamationTriangle,
  FaSearch,
  FaServer,
  FaTrashAlt,
} from "react-icons/fa"; // Import React Icons (Font Awesome)
import { ClipLoader } from "react-spinners";

function SpinList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spinList"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/spin`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${baseUrl}/api/spin/spinGroup/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("spinList"); // Refresh the spin list
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id) => {
    navigate(`/spin/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/spin/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <ClipLoader color="blue" size={50} />
      </div>
    );
  }

  // Error state
  if (isError) {
    // Check if the error is a network error or a server error
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred. Please try again later.";
    const statusCode = error?.response?.status;

    let errorIcon = <FaExclamationTriangle size={50} />; // Default error icon

    // Set the icon based on the error code
    if (statusCode === 404) {
      errorIcon = <FaSearch size={50} />;
    } else if (statusCode === 500) {
      errorIcon = <FaServer size={50} />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen text-center flex-col">
        <div className="flex justify-center mt-8 mb-5">
          <Link
            to={"/create/spin-group"}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
          >
            Create Spin Group
          </Link>
        </div>
        <div className="mb-4">
          {errorIcon} {/* Centering the icon */}
        </div>
        <p>
          {/* Display specific messages for known error codes or a generic message */}
          {statusCode === 404
            ? errorMessage
            : statusCode === 500
            ? "Server error. Please try again later."
            : errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Spin Group List
      </h1>

      <div className="flex justify-center mt-8 mb-5">
        <Link
          to={"/create/spin-group"}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
        >
          Create Spin Group
        </Link>
      </div>

      {data.participants.length > 0 ? (
        <div className="space-y-6">
          {data.participants.map((participant, participantIndex) => (
            <div
              key={participantIndex}
              className="relative max-w-4xl mx-auto p-6 border rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-6 mt-4">
                <h2 className="text-2xl font-extrabold text-gray-700">
                  {participant.category}
                </h2>
                <span className="text-lg font-bold text-white bg-purple-600 px-4 py-2 rounded-lg shadow">
                  ₹{participant.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="absolute top-1 right-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full shadow">
                Total Participants: {participant.users.length}
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleDelete(participant._id)}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  <FaTrashAlt className="text-center" />
                </button>
              </div>

              {/* View Link */}
              <div className="mt-4 text-center">
                <Link
                  to={`/spin-view/${participant._id}`} // Assuming you have a detailed view for each participant
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Participants
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No participants found.</div>
      )}
    </div>
  );
}

export default SpinList;
