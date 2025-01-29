import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import {
  FaCashRegister,
  FaListAlt,
  FaStickyNote,
  FaRegCreditCard,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { PiSpinnerBallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-3xl font-semibold p-2 border bg-white rounded-xl">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6--vXaMXwTHiXS7ImPFZMaKGOcnbAttL8oA&s"
              alt="Logo"
              className="h-8 rounded-full"
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white text-2xl focus:outline-none"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Navbar Links (Desktop) */}
          <div className="hidden lg:flex space-x-4 items-center">
            {[
              { path: "/dashboard", label: "Dashboard" },
              { path: "/summary", label: "Summary" },
              { path: "/cash-in", label: "Cash In" },
              { path: "/cash-out", label: "Cash Out" },
              { path: "/cash-received", label: "Cash Received" },
              { path: "/cash-paid", label: "Cash Paid" },
              { path: "/expense-list", label: "Expense" },
              { path: "/notebook-list", label: "Notebook" },
              { path: "/spin-list", label: "Spin" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-gray-200 text-md font-medium px-3 py-2 rounded-md transition duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Profile */}
            <Link
              to="/profile"
              className="bg-white text-black px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              {user ? user.username : ""}
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 z-40 lg:hidden overflow-y-auto`}
      >
        <div className="p-6">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-black text-2xl"
          >
            <FiX />
          </button>

          <div className="space-y-4 mt-16">
            {[
              {
                path: "/dashboard",
                label: "Dashboard",
                icon: <AiOutlineHome />,
              },
              { path: "/summary", label: "Summary", icon: <FaListAlt /> },
              { path: "/cash-in", label: "Cash In", icon: <FaCashRegister /> },
              {
                path: "/cash-out",
                label: "Cash Out",
                icon: <FaCashRegister />,
              },
              {
                path: "/cash-received",
                label: "Cash Received",
                icon: <FaRegCreditCard />,
              },
              {
                path: "/cash-paid",
                label: "Cash Paid",
                icon: <FaRegMoneyBillAlt />,
              },
              { path: "/expense-list", label: "Expense", icon: <FaListAlt /> },
              {
                path: "/notebook-list",
                label: "Notebook",
                icon: <FaStickyNote />,
              },
              {
                path: "/spin-list",
                label: "Spin",
                icon: <PiSpinnerBallFill />,
              },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleSidebar}
                className="flex items-center text-black hover:bg-gray-200 px-4 py-3 rounded-md transition duration-200"
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center my-6 border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            {/* Profile Icon */}
            <Link
              to="/profile"
              className="flex flex-col items-center text-center"
            >
              <FaUserCircle size={80} className="text-gray-500 mb-3" />
              <p className="text-lg font-semibold text-blue-600 hover:underline">
                {user?.username || "John Doe"}
              </p>
              <p className="text-sm text-gray-600">
                {user?.email || "johndoe@example.com"}
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default Navbar;
