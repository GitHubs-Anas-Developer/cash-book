import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/Url";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FaEye for eye, FaEyeSlash for eyeOff
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = (e) => {
    e.preventDefault(); // Prevent button click from submitting the form
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        loginForm,
        { withCredentials: "include" }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 flex justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Welcome Back
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="w-full mt-2 px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={loginForm.email}
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
              className="w-full mt-2 px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={loginForm.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-[52px] transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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
              {mutation.isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Sign Up Redirect */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
