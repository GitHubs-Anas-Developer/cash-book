import React, { useState } from "react";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { baseUrl } from "../constant/Url";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

function Profile({ user }) {
  const [username, setUsername] = useState(user?.username || "John Doe");
  const [email, setEmail] = useState(user?.email || "johndoe@example.com");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/auth/logout`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      toast.error("Error logging out. Please try again.");
    },
    onSuccess: (response) => {
      toast.success(response.message);
      // Redirect to login or home page if necessary
    },
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", { username, email });
    toast.success("Profile updated successfully!");
    // Add profile update logic here
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password Change:", { oldPassword, newPassword });
    toast.success("Password changed successfully!");
    // Add password change logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <FaUserCircle size={100} className="text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold">{username}</h2>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Update Profile
          </h3>

          {/* Username */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaUserCircle className="text-gray-500 mr-3" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Update username"
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Update email"
              className="w-full focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Change Password
          </h3>

          {/* Old Password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old password"
              className="w-full focus:outline-none"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            Change Password
          </button>
        </form>

        {/* Logout Button */}
        <button
          onClick={() => logoutMutation.mutate()}
          className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
