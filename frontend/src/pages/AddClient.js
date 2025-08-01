import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddClient() {
  const [client, setClient] = useState({ name: "", email: "", phone: "", company: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value)) {
        setClient({ ...client, [name]: value });
      }
    } else {
      setClient({ ...client, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/clients", client);
      navigate("/clients");
    } catch (err) {
      alert("Failed to add client");
      console.error(err);
    }
  };

  // Styles
  const containerStyle = {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  };
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    padding: "32px",
    maxWidth: "400px",
    margin: "0 auto"
  };
  const titleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "30px",
    paddingBottom: "8px",
    borderBottom: "2px solid #f1f5f9",
    textAlign: "center",
    letterSpacing: "0.5px"
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    fontSize: "13px",
    marginBottom: "12px",
    backgroundColor: "white",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
  };
  const actionBarStyle = {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "8px"
  };
  const saveButtonStyle = {
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    color: "white",
    transition: "all 0.3s"
  };
  const cancelButtonStyle = {
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
    color: "white",
    transition: "all 0.3s"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>➕ Add Client</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="name"
            value={client.name}
            placeholder="Name"
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="email"
            name="email"
            value={client.email}
            placeholder="Email"
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="tel"
            pattern="\d*"
            name="phone"
            value={client.phone}
            placeholder="Phone (digits only)"
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="company"
            value={client.company}
            placeholder="Company"
            onChange={handleChange}
            style={inputStyle}
          />
          <div style={actionBarStyle}>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={e => { e.target.style.filter = "brightness(1.1)"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.filter = "brightness(1)"; e.target.style.transform = "translateY(0)"; }}
            >
              💾 Add Client
            </button>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={() => navigate("/clients")}
              onMouseEnter={e => { e.target.style.filter = "brightness(1.1)"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.filter = "brightness(1)"; e.target.style.transform = "translateY(0)"; }}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClient;
