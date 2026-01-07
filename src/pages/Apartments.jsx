import React, { useState, useEffect } from 'react';
import ApartmentForm from '../components/ApartmentForm';
import { getApartments } from '../services/dataService';
import { Plus } from 'lucide-react';

const Apartments = () => {
  const [showForm, setShowForm] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const data = await getApartments();
      setApartments(data);
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Apartments Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Apartment</>}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Add New Apartment</h2>
          <ApartmentForm onSuccess={() => {
            setShowForm(false);
            fetchApartments();
          }} />
        </div>
      )}

      <div className="content-area">
        {loading ? (
          <p>Loading apartments...</p>
        ) : apartments.length === 0 ? (
          <p className="empty-state">No apartments added yet.</p>
        ) : (
          <div className="items-grid">
            {apartments.map((apt) => (
              <div key={apt.id} className="item-card">
                <div className="card-image">
                  {apt.images && apt.images.length > 0 ? (
                    <img src={apt.images[0]} alt={apt.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="card-details">
                  <h3>{apt.name}</h3>
                  <p className="price">{Number(apt.price).toLocaleString()} GNF</p>
                  <div className="specs">
                    <span>{apt.bedrooms} Bed</span>
                    <span>•</span>
                    <span>{apt.bathrooms} Bath</span>
                  </div>
                  <p className="description">{apt.description.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Apartments;
