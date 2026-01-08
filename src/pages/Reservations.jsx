import React, { useState, useEffect } from 'react';
import { getReservations, updateReservationStatus } from '../services/dataService';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaClock, FaCalendarAlt, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import '../App.css'; // Reusing global styles where possible

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setProcessingId(id);
    try {
      await updateReservationStatus(id, newStatus);
      // Update local state
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      ));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="loading">Loading reservations...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reservations Management</h1>
      </div>

      <div className="reservations-content">
        {reservations.length === 0 ? (
          <p className="no-data">No reservations found.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>User</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td data-label="Item">
                      <div className="table-item-info">
                        {res.itemImage && <img src={res.itemImage} alt={res.itemName} className="table-thumb" />}
                        <div>
                          <div style={{fontWeight: 'bold'}}>{res.itemName}</div>
                          <div style={{fontSize: '0.85rem', color: '#6b7280'}}>{res.itemType}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="User">
                      <div className="admin-detail-row">
                        <FaUser className="icon" size={14} /> {res.userName}
                      </div>
                    </td>
                    <td data-label="Dates">
                      <div className="table-cell-content">
                        <div>
                          <FaCalendarAlt className="icon" size={14} style={{marginRight: '8px', color: 'var(--primary-color)'}} />
                          {format(new Date(res.startDate), 'dd MMM')} - {format(new Date(res.endDate), 'dd MMM yyyy')}
                        </div>
                        <div style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '4px'}}>
                          {res.duration} days • {res.createdAt ? format(res.createdAt.toDate(), 'dd MMM HH:mm') : ''}
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">
                      <div className="admin-detail-row">
                        <FaMoneyBillWave className="icon" size={14} /> {res.totalPrice.toLocaleString()} GNF
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`admin-status-badge admin-status-${res.status}`}>
                        {res.status.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="table-actions">
                        {res.status === 'pending' && (
                          <>
                            <button 
                              className="btn-accept btn-sm" 
                              onClick={() => handleStatusUpdate(res.id, 'accepted')}
                              disabled={processingId === res.id}
                              title="Accept"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn-reject btn-sm" 
                              onClick={() => handleStatusUpdate(res.id, 'rejected')}
                              disabled={processingId === res.id}
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {res.status === 'accepted' && (
                          <button 
                            className="btn-cancel btn-sm" 
                            onClick={() => handleStatusUpdate(res.id, 'rejected')}
                            disabled={processingId === res.id}
                            title="Cancel Reservation"
                            style={{backgroundColor: '#ef4444'}}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
