import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import ApartmentForm from '../components/ApartmentForm';
import { getApartments, deleteApartment } from '../services/dataService';

const Apartments = () => {
  const [showForm, setShowForm] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApartment, setEditingApartment] = useState(null);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const data = await getApartments();
      setApartments(data);
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingApartment(null);
    fetchApartments();
  };

  const handleEdit = (apartment) => {
    setEditingApartment(apartment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      try {
        await deleteApartment(id);
        fetchApartments();
      } catch (error) {
        console.error("Failed to delete apartment:", error);
        alert("Failed to delete apartment.");
      }
    }
  };

  const handleAddNew = () => {
    setEditingApartment(null);
    setShowForm(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Apartments</h1>
          <p>Manage your property listings</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={20} />
          <span>Add New Apartment</span>
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingApartment ? 'Edit Apartment' : 'Add New Apartment'}</h2>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowForm(false);
                  setEditingApartment(null);
                }}
              >
                &times;
              </button>
            </div>
            <ApartmentForm onSuccess={handleFormSuccess} initialData={editingApartment} />
          </div>
        </div>
      )}

      {/* Search and Filter Section - Placeholder for now */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Search apartments..." />
        </div>
        <button className="btn-secondary">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Apartments Grid */}
      {loading ? (
        <div className="loading-state">Loading apartments...</div>
      ) : (
        <div className="admin-items-grid">
          {apartments.map((apt) => (
            <div key={apt.id} className="admin-item-card">
              <div className="admin-card-image">
                {apt.images && apt.images.length > 0 ? (
                  <img src={apt.images[0]} alt={apt.name} />
                ) : (
                  <div className="admin-placeholder-image">No Image</div>
                )}
              </div>
              <div className="admin-card-details">
                <h3>{apt.name}</h3>
                <p className="admin-card-price">{Number(apt.price).toLocaleString()} GNF</p>
                {apt.amenities && apt.amenities.length > 0 && (
                  <div className="admin-card-specs">
                    {apt.amenities.map((item, index) => (
                      <span key={index}>{item}</span>
                    ))}
                  </div>
                )}
                {apt.category && !apt.amenities && (
                  <div className="admin-card-specs">
                    <span>{apt.category}</span>
                  </div>
                )}
                <p className="admin-card-description">{apt.description.substring(0, 80)}...</p>
                
                <div className="admin-card-actions">
                  <button 
                    className="admin-btn-icon admin-btn-edit" 
                    onClick={() => handleEdit(apt)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="admin-btn-icon admin-btn-delete" 
                    onClick={() => handleDelete(apt.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {apartments.length === 0 && (
            <div className="admin-empty-state">
              <p>No apartments found. Add your first listing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Apartments;
