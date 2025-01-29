import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar/Navbar";
import Cashbook from "./components/form/Cashbook";
import Summary from "./pages/Summary";
import CashIn from "./pages/CashIn";
import CashOut from "./pages/CashOut";
import Notebook from "./pages/Notebook";
import NotebookList from "./pages/NotebookList";
import NotebookForm from "./components/form/NotebookForm";
import ExpanseForm from "./components/form/ExpanseForm";
import ExpenseList from "./pages/ExpenseList";
import Expense from "./pages/Expense";
import NotebookEdit from "./components/edit/NotebookEdit";
import ExpenseEdit from "./components/edit/ExpenseViewEdit";
import ExpenseViewEdit from "./components/edit/ExpenseViewEdit";
import AddExpense from "./components/add/AddExpense";
import SpinForm from "./components/form/SpinForm";
import SpinList from "./pages/SpinList";
import Spin from "./pages/Spin";
import SpinAddUser from "./components/add/SpinAddUser";
import SpinWinner from "./pages/SpinWinner";
import Profile from "./pages/Profile";
import CashInEdit from "./components/edit/CashInEdit";
import CashOutEdit from "./components/edit/CashOutEdit";
import CashReceived from "./pages/CashReceived";
import CashPaid from "./pages/CashPaid";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./constant/Url";
import axios from "axios";
import AuthCheck from "./pages/auth/AuthCheck";
import SpinEdit from "./components/edit/SpinEdit";

function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/auth/profile`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      return response.data;
    },
  });

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50  mt-16">
      <Navbar user={data} />
      <Routes>
        {/* <Route path="/" element={<AuthCheck />} /> */}

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile user={data} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-cashbook" element={<Cashbook />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/cash-in" element={<CashIn />} />
        <Route path="/cash-in/edit/:id" element={<CashInEdit />} />
        <Route path="/cash-out" element={<CashOut />} />
        <Route path="/cash-out/edit/:id" element={<CashOutEdit />} />
        <Route path="/cash-Received" element={<CashReceived />} />
        <Route path="/cash-paid" element={<CashPaid />} />
        <Route path="/create-notebook" element={<NotebookForm />} />
        <Route path="/notebook-list" element={<NotebookList />} />
        <Route path="/notebook/view/:id" element={<Notebook />} />
        <Route path="/notebook/edit/:id" element={<NotebookEdit />} />
        <Route path="/create-expense" element={<ExpanseForm />} />
        <Route path="/expense-list" element={<ExpenseList />} />
        <Route path="/expense/view/:id" element={<Expense />} />
        <Route path="/expenses/add/:id" element={<AddExpense />} />
        <Route path="/expense/view/edit/:id" element={<ExpenseViewEdit />} />
        <Route path="/create/spin-group" element={<SpinForm />} />
        <Route path="/spin-list" element={<SpinList />} />
        <Route path="/spin-view/:id" element={<Spin />} />
        <Route path="/spin-view/edit/:id" element={<SpinEdit />} />
        <Route path="/spin/add/user/:id" element={<SpinAddUser />} />
        <Route path="/spin/winner/:id" element={<SpinWinner />} />

        <Route path="/*" element={<Dashboard />} />
      </Routes>
      <Toaster duration={5000} />
    </div>
  );
}

export default App;
