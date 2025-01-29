import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";
import { PiSpinnerBallFill } from "react-icons/pi";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Spin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Fetch spin data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Spin", id],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/spin/single/${id}`, {
        withCredentials: "include",
      });
      return response.data;
    },
  });

  // Mutation for deleting the spin
  const deleteSpin = useMutation({
    mutationFn: async () => {
      await axios.delete(`${baseUrl}/api/spin/single/${id}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("Spin deleted successfully!");
      navigate("/spins");
    },
    onError: () => {
      toast.error("Error deleting the spin. Please try again.");
    },
  });

  // Mutation for deleting a user
  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`${baseUrl}/api/spin/spinGroupUser/${id}/${userId}`, {
        withCredentials: "include",
      });
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
    },
    onError: () => {
      toast.error("Error deleting user. Please try again.");
    },
  });

  const handleDeleteSpin = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this spin?"
    );
    if (confirmed) {
      deleteSpin.mutate();
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      deleteUser.mutate(userId);
    }
  };

  const handleSpinNow = () => {
    if (data?.spin[0].users.length > 0) {
      setIsSpinning(true);
      setIsModalOpen(true);

      // Simulate the spin process
      setTimeout(() => {
        const randomUser =
          data.spin[0].users[
            Math.floor(Math.random() * data.spin[0].users.length)
          ];
        navigate(`/spin/winner/${randomUser._id}`);
        setIsSpinning(false);
      }, 30000); // Simulate a 3-second spin duration
    } else {
      toast.error("No participants available for the spin.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          Error loading spin data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Spin Details</h1>

      <div className="flex justify-between items-center mb-5">
        <Link
          to={`/spin/add/user/${data?.spin[0]._id}`}
          className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300 ease-in-out"
        >
          <FaUserPlus size={25} className="inline" />
        </Link>
        <Link
          to={`/spin-view/edit/${id}`}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out"
        >
          <FaEdit size={25} className="inline" />
        </Link>
      </div>

      <div className="text-center mb-5">
        <button
          onClick={handleSpinNow}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out font-extrabold text-3xl"
        >
          Spin Now <PiSpinnerBallFill size={55} className="inline text-black" />
        </button>
      </div>

      {data.spin.map((sp, index) => (
        <div key={index} className="bg-white p-2 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">{sp.category}</h2>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-4 rounded-lg mb-6 shadow-lg">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-2xl font-bold">
              ₹{sp.totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4">Participants:</h3>
            {sp.users.map((user, userIndex) => (
              <div
                key={userIndex}
                className="p-4 bg-gray-100 rounded-md mb-4 flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full shadow-md mr-4">
                    {userIndex + 1}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    <p className="text-gray-600">
                      Amount: ₹{user.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
                >
                  <FaTrash className="inline" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal for Spin */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold text-center mb-4">
              {isSpinning ? "Spinning..." : ""}
            </h2>
            <div className="flex justify-center mb-6 w-64">
              {isSpinning ? (
                <PiSpinnerBallFill size={200} className="animate-spin" />
              ) : (
                <p className="text-gray-600">
                  The spin process has started. Please wait.
                </p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Spin;
