import React from 'react';

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome to TregoRent Admin Panel.</p>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Apartments</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
