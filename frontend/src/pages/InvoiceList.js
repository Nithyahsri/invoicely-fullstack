import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/invoices");
      const sortedInvoices = res.data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setInvoices(sortedInvoices);
    } catch (err) {
      alert("Failed to load invoices");
      console.error(err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const deleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/invoices/${id}`);
      loadInvoices();
    } catch (err) {
      alert("Failed to delete invoice");
      console.error(err);
    }
  };

  const downloadInvoicePdf = (id) => {
    axios.get(`http://localhost:8080/api/invoices/${id}/download`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        alert("Failed to download PDF");
      });
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    if (status === 'Paid') {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      };
    } else {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white'
      };
    }
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 8px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0'
  };

  const addButtonStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const headerCellStyle = {
    padding: '16px 20px',
    backgroundColor: '#f1f5f9',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const cellStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#334155'
  };

  const actionButtonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.2s ease'
  };

  const viewButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white'
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white'
  };

  const downloadButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white'
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    marginRight: '0'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📄 Invoices</h1>
        <Link 
          to="/add-invoice" 
          style={addButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
          }}
        >
          ➕ Add New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div style={{
          ...cardStyle,
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📄</div>
          <h3 style={{fontSize: '18px', color: '#64748b', margin: '0'}}>No invoices found</h3>
          <p style={{color: '#94a3b8', margin: '8px 0 0 0'}}>Create your first invoice to get started</p>
        </div>
      ) : (
        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Invoice ID</th>
                <th style={headerCellStyle}>Client Name</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Total Amount</th>
                <th style={headerCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => (
                <tr 
                  key={inv.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc';
                  }}
                >
                  <td style={{...cellStyle, fontWeight: '600', color: '#1e293b'}}>
                    #{inv.id}
                  </td>
                  <td style={cellStyle}>
                    <div style={{fontWeight: '500'}}>{inv.clientName}</div>
                  </td>
                  <td style={cellStyle}>
                    <span style={getStatusBadge(inv.status)}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{...cellStyle, fontWeight: '600', color: '#059669'}}>
                    ${inv.total ? inv.total.toFixed(2) : "0.00"}
                  </td>
                  <td style={cellStyle}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <Link 
                        to={`/invoice/${inv.id}`} 
                        style={viewButtonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        👁️ View
                      </Link>
                      <Link 
                        to={`/edit-invoice/${inv.id}`} 
                        style={editButtonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => downloadInvoicePdf(inv.id)}
                        style={downloadButtonStyle}
                        title="Download PDF"
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        ⬇️ PDF
                      </button>
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        style={deleteButtonStyle}
                        title="Delete Invoice"
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;
