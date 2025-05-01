import React, {useState, useRef, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Chart } from 'chart.js/auto';

// Inject CSS styles
const styles = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
  }

  .dashboard-container {
    padding: 24px;
    background-color: #f9fafb;
    min-height: 100vh;
  }

  .dashboard-header {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #2d3748;
  }

  .card {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: 24px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    color: #2d3748;
  }

  .section-subtitle {
    font-size: 14px;
    color: #718096;
  }

  .chart-container {
    position: relative;
    height: 250px;
  }

  .badge {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #00C853;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .stat-title {
    font-size: 18px;
    font-weight: 500;
    color: #2d3748;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    color: #00C853;
  }

  .stat-description {
    font-size: 14px;
    color: #4a5568;
  }

  .progress-circle {
    position: relative;
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }

  .progress-circle svg {
    width: 100%;
    height: 100%;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: bold;
    color: #00C853;
  }

  .stat-row {
    display: flex;
    align-items: center;
  }
`;

const injectStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
  return () => {
    document.head.removeChild(styleTag);
  };
};

const AnalyticsDashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [analytics, setAnalytics] = useState({
    missedChats: [],
    totalChats: 0,
    resolvedRate: 0,
    avgReplyTime: '0 SECS',
  });

  const labels = [
    'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5',
    'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11'
  ];

  // Inject styles
  useEffect(injectStyles, []);

  // Fetch analytics from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/chatAnalytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnalytics({
            missedChats: data.missedChats,
            totalChats: data.totalChats,
            resolvedRate: data.resolvedRate,
            avgReplyTime: data.avgReplyTime
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch analytics:', err);
      });
  }, []);

  // Chart draw/update
  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx || analytics.missedChats.length === 0) return;

    const data = {
      labels,
      datasets: [{
        label: 'Chats',
        data: analytics.missedChats,
        borderColor: '#00C853',
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#00C853',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      scales: {
        y: {
          beginAtZero: true,
          max: 15,
          ticks: { stepSize: 5 },
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
        },
        x: {
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          callbacks: {
            label: (context) => `Chats: ${context.raw}`,
          },
        },
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data,
      options
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [analytics.missedChats]);

  // Stats cards
  const stats = [
    {
      title: 'Average Reply Time',
      value: analytics.avgReplyTime,
      description: 'For highest customer satisfaction rates, aim to reply within 15 seconds.',
      icon: <FaInfoCircle style={{ color: '#3B82F6', marginRight: '8px' }} />,
    },
    {
      title: 'Resolved Tickets',
      value: `${analytics.resolvedRate}%`,
      description: 'Proactive invitations help attract more customers.',
      progress: analytics.resolvedRate,
    },
    {
      title: 'Total Chats',
      value: `${analytics.totalChats} Chats`,
      description: 'Total chats for all channels in the selected period.',
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Analytics Dashboard</h1>

      <div className="card">
        <div className="section-header">
          <span>Missed Chats</span>
          <span className="section-subtitle">Last 11 weeks</span>
        </div>
        <div className="chart-container">
          <canvas ref={chartRef} />
          <div className="badge">
            {Math.max(...analytics.missedChats)} missed chats
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="card" key={index}>
            <h2 className="stat-title">{stat.title}</h2>
            {stat.progress !== undefined ? (
              <div className="stat-row">
                <div className="progress-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="#00C853"
                      strokeWidth="3"
                      strokeDasharray={`${stat.progress}, 100`}
                    />
                  </svg>
                  <div className="progress-text">{stat.value}</div>
                </div>
                <p className="stat-description">{stat.description}</p>
              </div>
            ) : (
              <>
                <p className="stat-value">
                  {stat.icon}
                  {stat.value}
                </p>
                <p className="stat-description">{stat.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;