import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await axios.get(`http://localhost:8080/api/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        alert("Failed to load invoice details");
        console.error(err);
      }
    }
    fetchInvoice();
  }, [id]);

  const downloadInvoicePdf = () => {
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

  if (!invoice) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
        <h3 style={{fontSize: '18px', color: '#64748b'}}>Loading invoice details...</h3>
      </div>
    );
  }

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    padding: '32px',
    marginBottom: '24px'
  };

  const headerStyle = {
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '24px',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0'
  };

  const statusBadgeStyle = {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: invoice.status === 'Paid' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    display: 'inline-block'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  };

  const infoItemStyle = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  };

  const valueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  };

  const headerCellStyle = {
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderBottom: '2px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    textAlign: 'left'
  };

  const cellStyle = {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#334155'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '12px',
    transition: 'all 0.2s ease',
    display: 'inline-block'
  };

  const downloadButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white'
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: 'white',
    marginRight: '0'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📄 Invoice #{invoice.id}</h1>
          <div style={statusBadgeStyle}>
            {invoice.status}
          </div>
        </div>

        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={labelStyle}>Client Name</div>
            <div style={valueStyle}>{invoice.clientName}</div>
          </div>
          <div style={infoItemStyle}>
            <div style={labelStyle}>Issue Date</div>
            <div style={valueStyle}>
              {new Date(invoice.issueDate).toLocaleDateString()}
            </div>
          </div>
          <div style={infoItemStyle}>
            <div style={labelStyle}>Due Date</div>
            <div style={valueStyle}>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </div>
          </div>
          <div style={infoItemStyle}>
            <div style={labelStyle}>Total Amount</div>
            <div style={{...valueStyle, color: '#059669', fontSize: '20px'}}>
              ${invoice.total?.toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            📋 Invoice Items
          </h3>
          
          {invoice.items && invoice.items.length > 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Description</th>
                    <th style={{...headerCellStyle, textAlign: 'center'}}>Quantity</th>
                    <th style={{...headerCellStyle, textAlign: 'right'}}>Price</th>
                    <th style={{...headerCellStyle, textAlign: 'right'}}>Tax (%)</th>
                    <th style={{...headerCellStyle, textAlign: 'right'}}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={cellStyle}>{item.description}</td>
                      <td style={{...cellStyle, textAlign: 'center', fontWeight: '600'}}>{item.quantity}</td>
                      <td style={{...cellStyle, textAlign: 'right'}}>${item.price.toFixed(2)}</td>
                      <td style={{...cellStyle, textAlign: 'right'}}>{item.tax.toFixed(2)}%</td>
                      <td style={{...cellStyle, textAlign: 'right', fontWeight: '600', color: '#059669'}}>
                        ${(item.price * item.quantity * (1 + item.tax / 100)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{fontSize: '32px', marginBottom: '8px'}}>📝</div>
              <p style={{color: '#64748b', margin: '0'}}>No items found in this invoice</p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={downloadInvoicePdf}
            style={downloadButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ⬇️ Download PDF
          </button>
          <Link 
            to="/invoices" 
            style={backButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
