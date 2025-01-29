import axios from "axios";
import React, { useState } from "react";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaListAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { baseUrl } from "../../constant/Url";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function ExpenseForm() {
  // State for expense category and date
  const [expenseCategory, setExpenseCategory] = useState({
    category: "",
  });

  // State for expenses (array of title, amount, and category)
  const [expenses, setExpenses] = useState([
    {
      title: "",
      amount: "",
      date: new Date(),
    },
  ]);

  // Handle change for the category and date inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseCategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle change for the expense title, amount, and date
  const handleExpenseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [name]: value,
    };
    setExpenses(updatedExpenses);
  };

  // Add new expense to the list
  const addExpense = () => {
    setExpenses([...expenses, { title: "", amount: "", date: "" }]);
  };

  // Delete expense from the list
  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  // Mutation to submit expenses
  const mutate = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/api/expense/create`,
          {
            expenseCategory,
            expenses, // Send the expenses data instead
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
      setExpenseCategory({ category: "" });
      setExpenses([{ title: "", amount: "", date: "" }]);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate.mutate(); // Trigger the mutation when form is submitted
  };

  return (
    <div className="max-w-4xl mx-auto p-8  rounded-2xl   mt-10">
      <h2 className="text-3xl font-semibold text-center text-black mb-6">
         New Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Expense Category */}
        <div>
          <label
            className="block text-xl font-medium text-gray-700 mb-2"
            htmlFor="category"
          >
            Expense Category
          </label>
          <div className="mt-2 relative">
            <input
              type="text"
              id="category"
              name="category"
              value={expenseCategory.category}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              placeholder="Enter category"
              required
            />
            <FaListAlt
              className="absolute right-4 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Expense Title, Amount, and Date */}
        {expenses.map((exp, index) => (
          <div key={index} className="space-y-2">
            <div>
              <label
                className="block text-md font-medium text-gray-700 "
                htmlFor={`title-${index}`}
              >
                Expense Title
              </label>
              <input
                type="text"
                id={`title-${index}`}
                name="title"
                value={exp.title}
                onChange={(e) => handleExpenseChange(index, e)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder="Expense title"
                required
              />
            </div>
            <div>
              <label
                className="block text-md font-medium text-gray-700 "
                htmlFor={`amount-${index}`}
              >
                Amount
              </label>
              <input
                type="number"
                id={`amount-${index}`}
                name="amount"
                value={exp.amount}
                onChange={(e) => handleExpenseChange(index, e)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder="Amount"
                required
              />
            </div>
            {/* Date */}
            <div>
              <label
                className="block text-md font-medium text-gray-700 "
                htmlFor={`date-${index}`}
              >
                Date
              </label>
              <div className="mt-2 relative">
                <input
                  type="date"
                  id={`date-${index}`}
                  name="date"
                  value={exp.date}
                  onChange={(e) => handleExpenseChange(index, e)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>
            </div>

            {/* Delete Button */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-white  bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => deleteExpense(index)}
              >
                    <FaTrashAlt size={20} />
            
              </button>
            </div>
          </div>
        ))}

        {/* Add New Expense Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
            onClick={addExpense}
          >
            Add New Expense
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Submit Expenses
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
