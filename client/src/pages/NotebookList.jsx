import React from "react";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaExclamationTriangle, FaSearch, FaServer } from "react-icons/fa";

function NotebookList() {
  const navigate = useNavigate();

  // Corrected instantiation of QueryClient
  const queryClient = new QueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notebook"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/notebook`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  // Mutation for deleting a notebook
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${baseUrl}/api/notebook/${id}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("Notebook deleted successfully");
      // Refetch the data after deletion
      queryClient.invalidateQueries(["notebook"]);
    },
    onError: (error) => {
      toast.error("Error deleting notebook: " + error.message);
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
            to={"/create-notebook"}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
          >
            Create Notebook
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

  // Success state
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
        Notebook List
      </h1>

      <div className="flex justify-center mt-8 mb-5">
        <Link
          to={"/create-notebook"}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out mx-4"
        >
          Create Notebook
        </Link>
      </div>

      {data?.notebooks?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.notebooks.map((notebook) => (
            <div
              key={notebook._id}
              className="p-4 rounded-lg shadow-md border-l-4 border-blue-500"
            >
              <h2 className="text-lg font-semibold text-blue-700">
                {notebook.title}
              </h2>
              <p className="mt-2 text-gray-800">
                <strong>Heading:</strong> {notebook.heading}
              </p>

              <p className="text-sm text-gray-500">
                <strong>Created on:</strong>{" "}
                {new Date(notebook.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="mt-4 flex justify-center space-x-4">
                <Link
                  to={`/notebook/view/${notebook._id}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  View
                </Link>

                <Link
                  to={`/notebook/edit/${notebook._id}`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteMutation.mutate(notebook._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700 py-10">
          No notebooks found.
        </p>
      )}
    </div>
  );
}

export default NotebookList;
