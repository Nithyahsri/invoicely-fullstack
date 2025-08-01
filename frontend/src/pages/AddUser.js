import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  // Handle input changes
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Allow only digits for phone
      if (/^\d*$/.test(value)) {
        setUser({ ...user, [name]: value });
      }
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users", user);
      navigate("/users");
    } catch (err) {
      alert("Failed to add user");
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
  const actionBarStyle = {
    display: "flex",
    gap: "16px",
    justifyContent: "center"
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
        <h2 style={titleStyle}>➕ Add New User</h2>
        <form onSubmit={onSubmit} autoComplete="off">
          <div style={{ marginBottom: "8px" }}>
            <label style={labelStyle}>Name:</label>
            <input
              type="text"
              style={inputStyle}
              name="name"
              value={user.name}
              onChange={onChange}
              required
            />
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              style={inputStyle}
              name="email"
              value={user.email}
              onChange={onChange}
              required
            />
          </div>
          <div style={{ marginBottom: "4px" }}>
            <label style={labelStyle}>Phone:</label>
            <input
              type="tel"
              pattern="\d*"
              style={inputStyle}
              name="phone"
              value={user.phone}
              onChange={onChange}
              required
              placeholder="Enter digits only"
            />
          </div>
          <div style={actionBarStyle}>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={e => { e.target.style.filter = "brightness(1.1)"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.filter = "brightness(1)"; e.target.style.transform = "translateY(0)"; }}
            >
              💾 Save
            </button>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={() => navigate("/users")}
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

export default AddUser;
