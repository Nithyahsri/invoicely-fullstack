import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    clientName: "",
    issueDate: "",
    dueDate: "",
    status: "Unpaid",
    total: 0,
  });

  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0, tax: 0 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await axios.get(`http://localhost:8080/api/invoices/${id}`);

        const inv = {
          ...res.data,
          issueDate: res.data.issueDate ? res.data.issueDate.slice(0, 10) : "",
          dueDate: res.data.dueDate ? res.data.dueDate.slice(0, 10) : "",
        };
        setInvoice(inv);

        const preprocessedItems = (res.data.items && res.data.items.length > 0)
          ? res.data.items.map(item => ({
              description: item.description || "",
              quantity: item.quantity ?? 1,
              price: item.price ?? 0,
              tax: item.tax ?? 0,
            }))
          : [{ description: "", quantity: 1, price: 0, tax: 0 }];
        setItems(preprocessedItems);
        setLoading(false);
      } catch (err) {
        alert("Failed to load invoice");
        console.error(err);
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + (item.price * item.quantity) * (1 + item.tax / 100),
      0
    );
    setInvoice((prev) => ({ ...prev, total }));
  }, [items]);

  const handleInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = field === "description" ? value : Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0, tax: 0 }]);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const onFocusNumber = (e) => {
    if (e.target.value === "0") e.target.value = "";
  };

  const onBlurNumber = (e, valueSetter) => {
    if (e.target.value === "") {
      valueSetter(0);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/invoices/${id}`, { ...invoice, items });
      alert("Invoice updated successfully");
      navigate("/invoices");
    } catch (err) {
      alert("Failed to update invoice");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
        <h3 style={{fontSize: '18px', color: '#64748b'}}>Loading invoice...</h3>
      </div>
    );
  }

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f1f5f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    display: 'block'
  };

  const sectionStyle = {
    marginBottom: '24px'
  };

  const itemSectionStyle = {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    marginBottom: '12px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const addItemButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white'
  };

  const removeButtonStyle = {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  };

  const updateButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    fontSize: '15px',
    padding: '12px 28px',
    marginRight: '12px'
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: 'white',
    fontSize: '15px',
    padding: '12px 28px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>✏️ Edit Invoice #{id}</h1>
        
        <form onSubmit={onSubmit}>
          {/* Invoice Details Section - COMPACT LAYOUT */}
          <div style={sectionStyle}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              📋 Invoice Information
            </h3>
            
            {/* 4-Column Layout: Client, Issue Date, Due Date, Status */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={labelStyle}>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="Enter client name"
                  value={invoice.clientName}
                  onChange={handleInvoiceChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={labelStyle}>Issue Date *</label>
                <input
                  type="date"
                  name="issueDate"
                  value={invoice.issueDate}
                  onChange={handleInvoiceChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={invoice.dueDate}
                  onChange={handleInvoiceChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  name="status"
                  value={invoice.status}
                  onChange={handleInvoiceChange}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Items Section - FIXED LAYOUT */}
          <div style={sectionStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0'
              }}>
                🛍️ Invoice Items
              </h3>
              <button 
                type="button" 
                onClick={addItem} 
                style={addItemButtonStyle}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ➕ Add Item
              </button>
            </div>
            
            {items.map((item, idx) => (
              <div key={idx} style={itemSectionStyle}>
                {/* Description - Full Width Row */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="Item description"
                    style={{
                      ...inputStyle,
                      width: '100%',
                      maxWidth: '100%'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Quantity, Price, Tax, Delete - Properly Spaced */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'end'
                }}>
                  <div style={{ width: '90px' }}>
                    <label style={labelStyle}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity === 0 ? "" : item.quantity}
                      onFocus={onFocusNumber}
                      onBlur={(e) => onBlurNumber(e, (val) => handleItemChange(idx, "quantity", val))}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  
                  <div style={{ width: '120px' }}>
                    <label style={labelStyle}>Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price === 0 ? "" : item.price}
                      onFocus={onFocusNumber}
                      onBlur={(e) => onBlurNumber(e, (val) => handleItemChange(idx, "price", val))}
                      onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  
                  <div style={{ width: '100px' }}>
                    <label style={labelStyle}>Tax (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.tax === 0 ? "" : item.tax}
                      onFocus={onFocusNumber}
                      onBlur={(e) => onBlurNumber(e, (val) => handleItemChange(idx, "tax", val))}
                      onChange={(e) => handleItemChange(idx, "tax", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  
                  <div style={{ 
                    width: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: '2px'
                  }}>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      style={removeButtonStyle}
                      title="Remove item"
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Action Buttons - COMBINED SECTION */}
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '20px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              💰 Total: ${invoice.total ? invoice.total.toFixed(2) : "0.00"}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                style={updateButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 15px -3px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Update Invoice
              </button>
              <button
                type="button"
                style={backButtonStyle}
                onClick={() => navigate("/invoices")}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ← Back to Invoices
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInvoice;
