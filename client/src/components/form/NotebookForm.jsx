import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/Url";

function NotebookForm() {
  const [notebook, setNotebook] = useState({
    heading: "",
    description: "",
  });

  const [notes, setNotes] = useState([
    {
      title: "",
      content: "",
    },
  ]);

  // Handle input changes for notebook heading/description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotebook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for individual notes
  const handleNotesChange = (index, field, value) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, [field]: value } : note
    );
    setNotes(updatedNotes);
  };

  // Add a new note entry
  const addNote = (e) => {
    e.preventDefault();
    setNotes([...notes, { title: "", content: "" }]);
  };

  const removeNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const mutate = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/api/notebook/create`,
          {
            notebook,
            notes,
          },
          {
            withCredentials: "include",
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      toast.error("Error submitting form: " + error.message);
    },
    onSuccess: (data) => {
      toast.success("Form submitted successfully");
      // Reset the form after successful submission
      setNotebook({ heading: "", description: "" });
      setNotes([{ title: "", content: "" }]);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate(); // Trigger the mutation here
  };

  return (
    <div className="max-w-lg mx-auto p-4  rounded-lg ">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add Notebook Entry
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Heading Field */}
        <div>
          <label
            htmlFor="heading"
            className="block text-sm font-medium text-gray-700"
          >
            Heading
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={notebook.heading}
            onChange={handleInputChange}
            placeholder="Enter heading"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={notebook.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            rows="3"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          />
        </div>

        {/* Add Note Button */}
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-transform transform hover:scale-105 active:scale-95"
            onClick={addNote}
          >
            Add Note
          </button>
        </div>

        {/* Notes Section */}
        {notes.map((note, index) => (
          <div key={index} className="space-y-2">
            {/* Note Title */}
            <div>
              <label
                htmlFor={`title-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Notes Title
              </label>
              <input
                type="text"
                id={`title-${index}`}
                name="title"
                value={note.title}
                onChange={(e) =>
                  handleNotesChange(index, "title", e.target.value)
                }
                placeholder="Enter note title"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            </div>

            {/* Note Content */}
            <div>
              <label
                htmlFor={`content-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Notes Content
              </label>
              <textarea
                id={`content-${index}`}
                name="content"
                value={note.content}
                onChange={(e) =>
                  handleNotesChange(index, "content", e.target.value)
                }
                placeholder="Enter note content"
                rows="4"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            </div>

            {/* Delete Note Button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => removeNote(index)}
              >
                Delete Note
              </button>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={mutate.isLoading} // Disable the button while mutation is loading
          >
            {mutate.isLoading ? "Saving..." : "Save Notebook"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotebookForm;
