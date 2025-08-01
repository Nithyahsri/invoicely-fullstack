import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ClientList from "./pages/ClientList";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";

import ExpenseList from "./pages/ExpenseList";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

import InvoiceList from "./pages/InvoiceList";
import AddInvoice from "./pages/AddInvoice";
import EditInvoice from "./pages/EditInvoice";
import InvoiceDetails from "./pages/InvoiceDetails"; // NEW

function App() {
  return (
    <Router>
      <div>
        <Sidebar />
        {/* Offset content to avoid sidebar overlap */}
        <div style={{ marginLeft: "16rem", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/clients/edit/:id" element={<EditClient />} />

            {/* Expense routes */}
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/expenses/add" element={<AddExpense />} />
            <Route path="/expenses/edit/:id" element={<EditExpense />} />

            {/* Invoice routes */}
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/add-invoice" element={<AddInvoice />} />
            <Route path="/edit-invoice/:id" element={<EditInvoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} /> {/* NEW */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
