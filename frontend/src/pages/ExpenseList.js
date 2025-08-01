import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [expensesRes, usersRes, clientsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/expenses"),
          axios.get("http://localhost:8080/api/users"),
          axios.get("http://localhost:8080/api/clients"),
        ]);
        setExpenses(expensesRes.data);
        setUsers(usersRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        alert("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getUserName = (userId) => {
    if (!userId) return "-";
    const user = users.find((u) => String(u.id) === String(userId));
    return user ? user.name : "-";
  };

  const getClientName = (clientId) => {
    if (!clientId) return "-";
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client ? client.name : "-";
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete expense");
      console.error(err);
    }
  };

  // Styles
  const containerStyle = {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    padding: "0 8px"
  };
  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: 0
  };
  const addButtonStyle = {
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    color: "white",
    padding: "12px 24px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 10px 15px -3px rgba(16,185,129,0.18)",
    transition: "all 0.2s",
    border: "none",
    cursor: "pointer"
  };
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.07)",
    border: "1px solid #e2e8f0",
    overflow: "hidden"
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };
  const headerCellStyle = {
    padding: "16px 18px",
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    fontWeight: 600,
    color: "#475569",
    textAlign: "left"
  };
  const cellStyle = {
    padding: "14px 18px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
    fontWeight: 500
  };
  const actionButtonStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    transition: "all 0.2s"
  };
  const editButtonStyle = {
    ...actionButtonStyle,
    background: "linear-gradient(135deg, #ff7c1d 0%, #c2410c 100%)",
    color: "white",
    fontWeight: "bold"
  };
  const deleteButtonStyle = {
    ...actionButtonStyle,
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    marginRight: "0"
  };

  if (loading)
    return (
      <div style={{
        ...containerStyle,
        color: "#64748b",
        textAlign: "center"
      }}>
        Loading expenses...
      </div>
    );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>💸 Expenses</h1>
        <Link
          to="/expenses/add"
          style={addButtonStyle}
          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0px)"}
        >
          ➕ Add Expense
        </Link>
      </div>

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>For</th>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Amount</th>
              <th style={headerCellStyle}>Category</th>
              <th style={headerCellStyle}>Date</th>
              <th style={headerCellStyle}>Description</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="8" style={{
                  ...cellStyle,
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "white" : "#f8fafc"
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = "#f1f5f9"}
                  onMouseLeave={e => e.target.style.backgroundColor = idx % 2 === 0 ? "white" : "#f8fafc"}
                >
                  <td style={cellStyle}>{expense.id}</td>
                  <td style={cellStyle}>
                    <span style={{
                      background: expense.userId
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "linear-gradient(135deg, #22d3ee 0%, #a21caf 100%)",
                      color: "white",
                      borderRadius: "15px",
                      padding: "3px 14px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {expense.userId ? "User" : "Client"}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                    {expense.userId
                      ? getUserName(expense.userId)
                      : getClientName(expense.clientId)}
                  </td>
                  <td style={{ ...cellStyle, color: "#059669", fontWeight: "bold" }}>
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td style={cellStyle}>{expense.category}</td>
                  <td style={cellStyle}>{expense.date}</td>
                  <td style={cellStyle}>{expense.description || "-"}</td>
                  <td style={{ ...cellStyle, minWidth: 130 }}>
                    <Link
                      to={`/expenses/edit/${expense.id}`}
                      style={editButtonStyle}
                      onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                      onMouseLeave={e => e.target.style.transform = "translateY(0px)"}
                    >
                      📝 Edit
                    </Link>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      style={deleteButtonStyle}
                      type="button"
                      aria-label={`Delete expense ${expense.id}`}
                      onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                      onMouseLeave={e => e.target.style.transform = "translateY(0px)"}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
