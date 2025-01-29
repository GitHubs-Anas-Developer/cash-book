import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Make sure to import this
import axios from "axios";
import { baseUrl } from "./../constant/Url";
import { ClipLoader } from "react-spinners";

function Notebook() {
  const { id } = useParams(); // Get the notebook ID from the URL
  console.log("id", id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notebook", id], // Include 'id' in the query key
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/notebook/single/${id}`, {
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-500">
          Error loading notebook data. Please try again.
        </p>
      </div>
    );
  }

  // Success state: Display notebook data
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
        Notebook Details
      </h1>
      <div className="p-4 bg-blue-100 rounded-lg shadow-md border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold text-blue-700">
          {data?.notebook.title}
        </h2>
        <p className="mt-2 text-gray-800">
          <strong>Heading:</strong> {data?.notebook.heading}
        </p>
        <p className="mt-2 text-gray-600">
          <strong>Description:</strong> {data?.notebook.description}
        </p>

        {/* Render Notes */}
        {data?.notebook.notes?.map((note, index) => (
          <div key={index} className="mt-4 bg-white p-4 rounded-md shadow-md">
            <h3 className="font-semibold text-blue-600">{note.title}</h3>
            <p className="text-gray-600">{note.content}</p>
          </div>
        ))}

        <p className="text-sm text-gray-500">
          <strong>Created on:</strong>{" "}
          {new Date(data?.notebook.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

export default Notebook;
