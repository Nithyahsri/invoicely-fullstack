import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      setUsers(res.data);
    } catch (err) {
      alert("Error loading users");
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      loadUsers();
    } catch (err) {
      alert("Failed to delete user");
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
    marginBottom: "32px",
    padding: "0 8px"
  };
  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: 0,
    paddingBottom: '8px',
    borderBottom: '2px solid #f1f5f9',
    maxWidth: '400px'
  };
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.09)",
    border: "1px solid #e2e8f0",
    overflowX: "auto",
    padding: '16px'
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: '600px'
  };
  const headerCellStyle = {
    padding: "16px 20px",
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap"
  };
  const cellStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle"
  };
  const emptyCellStyle = {
    ...cellStyle,
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic"
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>👤 User List</h1>
      </div>
      <div style={cardStyle}>
        <table style={tableStyle} role="grid" aria-label="User List">
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Email</th>
              <th style={headerCellStyle}>Phone</th>
              <th style={headerCellStyle} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={emptyCellStyle}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td style={cellStyle}>#{user.id}</td>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.phone}</td>
                  <td style={cellStyle}>
                    <Link
                      to={`/edit-user/${user.id}`}
                      style={editButtonStyle}
                      onMouseEnter={e => (e.target.style.transform = "translateY(-1px)")}
                      onMouseLeave={e => (e.target.style.transform = "translateY(0)")}
                    >
                      📝 Edit
                    </Link>
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={deleteButtonStyle}
                      type="button"
                      aria-label={`Delete user ${user.name}`}
                      onMouseEnter={e => (e.target.style.transform = "translateY(-1px)")}
                      onMouseLeave={e => (e.target.style.transform = "translateY(0)")}
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

export default UserList;
