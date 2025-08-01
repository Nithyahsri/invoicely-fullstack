import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({ name: "", email: "", phone: "", company: "" });

  useEffect(() => {
    const loadClient = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/clients/${id}`);
        setClient(res.data);
      } catch (err) {
        alert("Failed to load client");
        console.error(err);
      }
    };
    loadClient();
  }, [id]);

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
      await axios.put(`http://localhost:8080/api/clients/${id}`, client);
      alert("Client updated successfully");
      navigate("/clients");
    } catch (err) {
      alert("Failed to update client");
      console.error(err);
    }
  };

  // Styles (aligned with AddClient)
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
  const labelStyle = {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    display: "block",
    fontSize: "13px"
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
  const buttonStyle = {
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    display: "block",
    margin: "0 auto",
    maxWidth: "200px",
    transition: "all 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>✏️ Edit Client</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            name="name"
            value={client.name}
            onChange={handleChange}
            placeholder="Name"
            style={inputStyle}
            required
          />
          <input
            name="email"
            value={client.email}
            onChange={handleChange}
            placeholder="Email"
            style={inputStyle}
            required
            type="email"
          />
          <input
            type="tel"
            pattern="\d*"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            placeholder="Phone (digits only)"
            style={inputStyle}
            required
          />
          <input
            name="company"
            value={client.company}
            onChange={handleChange}
            placeholder="Company"
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.filter = "brightness(1.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.filter = "brightness(1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            💾 Update Client
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditClient;
