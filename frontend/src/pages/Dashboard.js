import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAnalytics(); }, []);
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/analytics/dashboard");
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 16, textAlign: 'center', color: '#3b4252' }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: 16, textAlign: 'center', color: '#dc2626' }}>Error: {error}<br />Make sure your backend is running!</div>;
  if (!analytics) return <div style={{ padding: 16, textAlign: 'center' }}>No analytics data available</div>;

  // Chart Data (safe defaults!)
  const statusChartData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [{
      data: [
        analytics?.statusDistribution?.Paid || 0,
        analytics?.statusDistribution?.Unpaid || 0
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 2,
    }],
  };
  const monthlyRevenueData = {
    labels: (analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0)
      ? analytics.monthlyRevenue.map(item => `Month ${item[0]}`)
      : ['No Data'],
    datasets: [{
      label: 'Revenue ($)',
      data: (analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0)
        ? analytics.monthlyRevenue.map(item => item[1])
        : [0],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      borderRadius: 4,
    }]
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{
        fontSize: 26, fontWeight: 700, marginBottom: 20, color: '#1e293b', letterSpacing: '0.04em'
      }}>
        📊 Invoice Analytics Dashboard
      </h1>

      {/* KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 16
      }}>
        {[
          {
            label: 'Total Invoices',
            value: analytics.totalInvoices ?? 0,
            borderColor: '#3b82f6',
            valueColor: '#1e40af'
          },
          {
            label: 'Total Revenue',
            value: `$${(analytics.totalRevenue?.toFixed(2)) || '0.00'}`,
            borderColor: '#10b981',
            valueColor: '#065f46'
          },
          {
            label: 'Outstanding Amount',
            value: `$${(analytics.outstandingAmount?.toFixed(2)) || '0.00'}`,
            borderColor: '#ef4444',
            valueColor: '#991b1b'
          },
          {
            label: 'Collection Rate',
            value: (() => {
              const total = (analytics.totalRevenue || 0) + (analytics.outstandingAmount || 0);
              if (total > 0) return ((analytics.totalRevenue / total) * 100).toFixed(1) + '%';
              return '0%';
            })(),
            borderColor: '#7c3aed',
            valueColor: '#5b21b6'
          }
        ].map(({ label, value, borderColor, valueColor }) => (
          <div key={label} style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 6px 12px -4px rgba(0,0,0,0.07)',
            borderLeft: `5px solid ${borderColor}`
          }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>{label}</h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: valueColor, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 18,
        marginBottom: 24
      }}>
        <div style={{
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid #16a34a',
          borderRadius: 10,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 80,
          boxShadow: '0 2px 8px -4px #4441'
        }}>
          <span style={{ fontSize: 22, marginBottom: 2, color: '#16a34a' }}>✔️</span>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#166534' }}>Paid Invoices</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#166534', marginTop: 1 }}>
            {analytics.statusDistribution?.Paid || 0}
          </div>
        </div>
        <div style={{
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid #dc2626',
          borderRadius: 10,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 80,
          boxShadow: '0 2px 8px -4px #4441'
        }}>
          <span style={{ fontSize: 22, marginBottom: 2, color: '#dc2626' }}>⏳</span>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#b91c1c' }}>Unpaid Invoices</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#b91c1c', marginTop: 1 }}>
            {analytics.statusDistribution?.Unpaid || 0}
          </div>
        </div>
        <div style={{
          backgroundColor: '#f9fafb',
          borderLeft: '4px solid #2563eb',
          borderRadius: 10,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 80,
          boxShadow: '0 2px 8px -4px #4441'
        }}>
          <span style={{ fontSize: 22, marginBottom: 2, color: '#2563eb' }}>💰</span>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1e40af' }}>Avg Invoice Value</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1e40af', marginTop: 1 }}>
            ${((analytics.totalRevenue + analytics.outstandingAmount) / (analytics.totalInvoices || 1)).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        minHeight: 256
      }}>
        {/* Status Distribution Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 6px 12px -4px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{
            fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#1e293b'
          }}>
            Invoice Status Distribution
          </h3>
          <div style={{
            width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '180px', maxHeight: '230px'
          }}>
            <div style={{ width: 180, height: 180 }}>
              <Doughnut
                data={statusChartData}
                options={{
                  responsive: false,
                  maintainAspectRatio: false,
                  cutout: '67%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { font: { size: 13 } }
                    },
                    tooltip: { bodyFont: { size: 13 } }
                  }
                }}
                width={180}
                height={180}
              />
            </div>
          </div>
        </div>
        {/* Monthly Revenue Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 6px 12px -4px rgba(0,0,0,0.07)'
        }}>
          <h3 style={{
            fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#1e293b'
          }}>
            Monthly Revenue
          </h3>
          <div style={{ height: 200 }}>
            <Bar
              data={monthlyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { bodyFont: { size: 13 } }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { font: { size: 13 } }, grid: { color: '#e5e7eb' } },
                  x: { ticks: { font: { size: 13 } }, grid: { display: false } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
