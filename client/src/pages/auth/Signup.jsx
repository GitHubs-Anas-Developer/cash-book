import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/Url";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FaEye for eye, FaEyeSlash for eyeOff

function Signup() {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = (e) => {
    e.preventDefault(); // Prevent button click from submitting the form
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (e) => {
    e.preventDefault(); // Prevent button click from submitting the form
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${baseUrl}/api/auth/register`,
        registerForm,
        { withCredentials: "include" }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full mt-1 border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              value={registerForm.username}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-1 border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              value={registerForm.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full mt-1 border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              value={registerForm.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full mt-1 border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              value={registerForm.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white font-medium py-3 rounded-md transition duration-300 ${
                mutation.isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Submitting..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
