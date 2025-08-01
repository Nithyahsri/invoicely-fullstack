import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        alert("Failed to load user");
        console.error(err);
      }
    };
    loadUser();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
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
      await axios.put(`http://localhost:8080/api/users/${id}`, user);
      alert("User updated successfully");
      navigate("/users");
    } catch (err) {
      alert("Failed to update user");
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
  const updateButtonStyle = {
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
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
        <h2 style={titleStyle}>✏️ Edit User</h2>
        <form onSubmit={onSubmit} autoComplete="off">
          <input
            name="name"
            value={user.name}
            onChange={onChange}
            placeholder="Name"
            style={inputStyle}
            required
          />
          <input
            name="email"
            value={user.email}
            onChange={onChange}
            placeholder="Email"
            style={inputStyle}
            required
            type="email"
          />
          <input
            type="tel"
            pattern="\d*"
            name="phone"
            value={user.phone}
            onChange={onChange}
            placeholder="Phone (digits only)"
            style={inputStyle}
            required
          />
          <div style={actionBarStyle}>
            <button
              type="submit"
              style={updateButtonStyle}
              onMouseEnter={e => { e.target.style.filter = "brightness(1.1)"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.filter = "brightness(1)"; e.target.style.transform = "translateY(0)"; }}
            >
              💾 Update User
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

export default EditUser;
