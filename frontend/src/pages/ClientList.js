import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/clients");
      setClients(res.data);
    } catch (err) {
      alert("Failed to load clients");
      console.error(err);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      alert("Failed to delete client");
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
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    overflowX: "auto",
    padding: '16px'
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: '720px'
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
    verticalAlign: 'middle'
  };

  const emptyCellStyle = {
    ...cellStyle,
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: 'italic'
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
    transition: "all 0.2s ease"
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
        <h1 style={titleStyle}>🏢 Client List</h1>
      </div>

      <div style={cardStyle}>
        <table style={tableStyle} role="grid" aria-label="Client List">
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Email</th>
              <th style={headerCellStyle}>Phone</th>
              <th style={headerCellStyle}>Company</th>
              <th style={headerCellStyle} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" style={emptyCellStyle}>
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} tabIndex={0}>
                  <td style={cellStyle}>#{client.id}</td>
                  <td style={cellStyle}>{client.name}</td>
                  <td style={cellStyle}>{client.email}</td>
                  <td style={cellStyle}>{client.phone}</td>
                  <td style={cellStyle}>
                    {client.company ? client.company : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>}
                  </td>
                  <td style={cellStyle}>
                    <Link
                      to={`/clients/edit/${client.id}`}
                      style={editButtonStyle}
                      onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                      onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                    >
                      📝 Edit
                    </Link>
                    <button
                      onClick={() => deleteClient(client.id)}
                      style={deleteButtonStyle}
                      type="button"
                      aria-label={`Delete client ${client.name}`}
                      onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                      onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
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

export default ClientList;
