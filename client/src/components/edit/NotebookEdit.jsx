import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../constant/Url";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function NotebookEdit() {
  const { id } = useParams();

  const [notebook, setNotebook] = useState({
    heading: "",
    description: "",
    notes: [],
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notebook", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/notebook/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.notebook) {
      setNotebook({
        heading: data.notebook.heading || "",
        description: data.notebook.description || "",
        notes: data.notebook.notes || [],
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updatedNotebook) => {
      return await axios.put(`${baseUrl}/api/notebook/${id}`, updatedNotebook, {
        withCredentials: "include",
      });
    },
  });

  const handleNotebookChange = (e) => {
    setNotebook({ ...notebook, [e.target.name]: e.target.value });
  };

  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...notebook.notes];
    updatedNotes[index][field] = value;
    setNotebook({ ...notebook, notes: updatedNotes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(notebook, {
      onSuccess: () => toast.success("Notebook updated successfully!"),
      onError: (err) => toast.error("Error updating notebook:", err),
    });
  };

  <div className="flex items-center justify-center min-h-screen  ">
    <ClipLoader color="blue" size={70} className="font-bold" />
  </div>;
  if (isError)
    return <div>Error: {error?.message || "Something went wrong!"}</div>;

  return (
    <div className="max-w-lg mx-auto p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Edit Notebook
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="heading"
            className="block text-lg font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={notebook.heading}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Notebook Title"
            onChange={handleNotebookChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="description"
            name="description"
            rows="6"
            value={notebook.description}
            onChange={handleNotebookChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            placeholder="Notebook description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Notes
          </label>
          {notebook.notes.map((note, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Note {index + 1}
              </label>
              <input
                type="text"
                value={note.title || ""}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Note Title"
                onChange={(e) =>
                  handleNoteChange(index, "title", e.target.value)
                }
              />
              <textarea
                rows="6"
                value={note.content || ""}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Note Content"
                onChange={(e) =>
                  handleNoteChange(index, "content", e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Update Notebook
        </button>
        {mutation.isError && (
          <div className="text-red-500 mt-4">
            Error updating notebook: {mutation.error?.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default NotebookEdit;
