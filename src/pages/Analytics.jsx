import React, { useEffect, useState } from 'react';
import { getApartments, getCars } from '../services/dataService';

const Analytics = () => {
  const [stats, setStats] = useState({
    apartmentClicks: 0,
    carClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apartments, cars] = await Promise.all([getApartments(), getCars()]);

        const apartmentClicks = apartments.reduce(
          (sum, apt) => sum + (apt.contactClicks || 0),
          0
        );
        const carClicks = cars.reduce(
          (sum, car) => sum + (car.contactClicks || 0),
          0
        );

        setStats({ apartmentClicks, carClicks });
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>See how many times guests clicked contact links.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Apartment contact clicks</h3>
          </div>
          <p className="stat-value">{stats.apartmentClicks}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Car contact clicks</h3>
          </div>
          <p className="stat-value">{stats.carClicks}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

