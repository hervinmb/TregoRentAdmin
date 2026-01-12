import React, { useEffect, useState } from 'react';
import { getApartments, getCars, getReservations } from '../services/dataService';
import { Building, Car, Calendar, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    apartments: 0,
    cars: 0,
    reservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apartmentsData, carsData, reservationsData] = await Promise.all([
          getApartments(),
          getCars(),
          getReservations()
        ]);
        
        setStats({
          apartments: apartmentsData.length,
          cars: carsData.length,
          reservations: reservationsData.length
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome to TregoRent Admin Panel.</p>
      
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2rem' }}>
          <Loader2 className="spinner" /> Loading stats...
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Apartments</h3>
              <div className="stat-icon">
                <Building size={24} />
              </div>
            </div>
            <p className="stat-value">{stats.apartments}</p>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Cars</h3>
              <div className="stat-icon">
                <Car size={24} />
              </div>
            </div>
            <p className="stat-value">{stats.cars}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Reservations</h3>
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
            </div>
            <p className="stat-value">{stats.reservations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
