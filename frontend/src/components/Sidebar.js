import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/users", label: "Users", icon: "👥" },
  { path: "/add-user", label: "Add User", icon: "➕", isSubItem: true },
  { path: "/clients", label: "Clients", icon: "🏢" },
  { path: "/clients/add", label: "Add Client", icon: "➕", isSubItem: true },
  { path: "/expenses", label: "Expenses", icon: "💰" },
  { path: "/invoices", label: "Invoices", icon: "📄" },
];

const Sidebar = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ totalInvoices: 0, thisMonthRevenue: 0 });

  useEffect(() => {
    // Fetch stats for sidebar from the backend
    axios.get("http://localhost:8080/api/analytics/dashboard")
      .then(res => {
        setStats({
          totalInvoices: res.data.totalInvoices ?? 0,
          thisMonthRevenue: res.data.totalRevenue ?? 0,
        });
      })
      .catch(err => {
        setStats({ totalInvoices: 0, thisMonthRevenue: 0 });
      });
  }, []);

  // Format revenue as "$XXK" if >= 1000 or "$XXX.XX" for less
  const formatRevenue = (value) => {
    if (!value || isNaN(value)) return "$0";
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${Number(value).toFixed(2)}`;
  };

  return (
    <aside style={{
      width: '256px',
      height: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: '0',
      top: '0',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      borderRight: '1px solid rgba(51, 65, 85, 0.5)',
      zIndex: 1000
    }}>
      {/* Header Section */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>I</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '20px', 
              fontWeight: 'bold', 
              margin: '0', 
              letterSpacing: '-0.025em',
              color: 'white'
            }}>
              Invoicely
            </h1>
            <p style={{
              fontSize: '12px', 
              color: '#94a3b8', 
              margin: '0', 
              fontWeight: '500'
            }}>
              Business Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav style={{
        flex: '1',
        padding: '24px 16px',
        overflowY: 'auto'
      }}>
        <div>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0 12px',
            marginBottom: '12px'
          }}>
            MAIN MENU
          </h2>
          
          {navItems.map((item) => {
            const isActive = 
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#cbd5e1',
                  background: isActive 
                    ? 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)' 
                    : 'transparent',
                  boxShadow: isActive ? '0 10px 15px -3px rgba(37, 99, 235, 0.4)' : 'none',
                  marginLeft: item.isSubItem ? '16px' : '0',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(51, 65, 85, 0.5)';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#cbd5e1';
                  }
                }}
              >
                <span style={{
                  marginRight: '12px',
                  fontSize: '18px',
                  opacity: isActive ? '1' : '0.7'
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Stats Section - Now dynamic stats */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(51, 65, 85, 0.5)'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(51, 65, 85, 0.3)'
        }}>
          <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px'
          }}>
            <span style={{fontSize: '12px', color: '#94a3b8', fontWeight: '500'}}>Total Invoices</span>
            <span style={{fontSize: '14px', color: '#10b981', fontWeight: 'bold'}}>
              {stats.totalInvoices}
            </span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontSize: '12px', color: '#94a3b8', fontWeight: '500'}}>Total Revenue</span>
            <span style={{fontSize: '14px', color: '#3b82f6', fontWeight: 'bold'}}>
              {formatRevenue(stats.thisMonthRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(51, 65, 85, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{color: 'white', fontSize: '14px', fontWeight: 'bold'}}>A</span>
          </div>
          <div style={{flex: '1'}}>
            <p style={{
              fontSize: '14px', 
              fontWeight: '500', 
              color: 'white', 
              margin: '0'
            }}>
              Admin User
            </p>
            <p style={{
              fontSize: '12px', 
              color: '#94a3b8', 
              margin: '0'
            }}>
              bmnithyashri@gmail.com
            </p>
          </div>
        </div>
        <div style={{marginTop: '12px', textAlign: 'center'}}>
          <p style={{fontSize: '12px', color: '#64748b', margin: '0'}}>
            &copy; {new Date().getFullYear()} Invoicely
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
