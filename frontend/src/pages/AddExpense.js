import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    type: "user",
    selectedId: "",
  });

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8080/api/clients").then((res) => setClients(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setExpense((prev) => ({ ...prev, type: value, selectedId: "" }));
    } else {
      setExpense((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense.selectedId) {
      alert(`Please select a ${expense.type}.`);
      return;
    }
    const payload = {
      amount: parseFloat(expense.amount),
      category: expense.category,
      date: expense.date,
      description: expense.description,
      userId: expense.type === "user" ? parseInt(expense.selectedId) : null,
      clientId: expense.type === "client" ? parseInt(expense.selectedId) : null,
    };
    try {
      await axios.post("http://localhost:8080/api/expenses", payload);
      navigate("/expenses");
    } catch (err) {
      alert("Failed to add expense");
      console.error(err);
    }
  };

  // Shared styles
  const containerStyle = {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  };
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 16px -3px rgba(0,0,0,0.09)",
    border: "1px solid #e2e8f0",
    padding: "24px",
    maxWidth: "430px",
    margin: "0 auto"
  };
  const titleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "20px",
    paddingBottom: "4px",
    borderBottom: "2px solid #f1f5f9",
    textAlign: "center",
    letterSpacing: "0.5px"
  };
  const labelStyle = {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
    display: "block",
    fontSize: "13px"
  };
  const inputStyle = {
    width: "100%",
    padding: "9px 13px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    fontSize: "13px",
    marginBottom: "8px",
    backgroundColor: "white",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
  };
  const actionBarStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0",
    gap: "16px",
    background: "#f1f5f9",
    borderRadius: "10px",
    marginTop: "12px"
  };
  const buttonStyle = {
    padding: "11px 22px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    marginRight: "0",
    cursor: "pointer",
    transition: "all 0.2s"
  };
  const addButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    color: "white"
  };
  const cancelButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
    color: "white"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>➕ Add Expense</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>Expense For:</label>
            <select
              name="type"
              value={expense.type}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="user">User</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>{expense.type === "user" ? "User" : "Client"}:</label>
            <select
              name="selectedId"
              value={expense.selectedId}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select {expense.type === "user" ? "User" : "Client"}</option>
              {(expense.type === "user" ? users : clients).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>Amount:</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Amount"
              required
            />
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>Category:</label>
            <input
              type="text"
              name="category"
              value={expense.category}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Category"
              required
            />
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>Date:</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={{marginBottom: "10px"}}>
            <label style={labelStyle}>Description:</label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              placeholder="Description"
              style={{ ...inputStyle, minHeight: 42, resize: "vertical", marginBottom: 0 }}
              rows={2}
            />
          </div>
          {/* **Action buttons always visible!** */}
          <div style={actionBarStyle}>
            <button
              type="submit"
              style={addButtonStyle}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              💾 Add Expense
            </button>
            <button
              type="button"
              onClick={() => navigate("/expenses")}
              style={cancelButtonStyle}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
