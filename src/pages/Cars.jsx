import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import CarForm from '../components/CarForm';
import { getCars, deleteCar } from '../services/dataService';

const Cars = () => {
  const [showForm, setShowForm] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCar(null);
    fetchCars();
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(id);
        fetchCars();
      } catch (error) {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car.");
      }
    }
  };

  const handleAddNew = () => {
    setEditingCar(null);
    setShowForm(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Cars</h1>
          <p>Manage your vehicle listings</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={20} />
          <span>Add New Car</span>
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowForm(false);
                  setEditingCar(null);
                }}
              >
                &times;
              </button>
            </div>
            <CarForm onSuccess={handleFormSuccess} initialData={editingCar} />
          </div>
        </div>
      )}

      {/* Search and Filter Section - Placeholder for now */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Search cars..." />
        </div>
        <button className="btn-secondary">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="loading-state">Loading cars...</div>
      ) : (
        <div className="admin-items-grid">
          {cars.map((car) => (
            <div key={car.id} className="admin-item-card">
              <div className="admin-card-image">
                {car.images && car.images.length > 0 ? (
                  <img src={car.images[0]} alt={car.name} />
                ) : (
                  <div className="admin-placeholder-image">No Image</div>
                )}
              </div>
              <div className="admin-card-details">
                <h3>{car.name}</h3>
                <p className="admin-card-price">{Number(car.price).toLocaleString()} GNF/Day</p>
                <div className="admin-card-specs">
                  <span>{car.model}</span>
                  <span>•</span>
                  <span>{car.transmission}</span>
                  <span>•</span>
                  <span>A/C: {car.airConditioning}</span>
                </div>
                <p className="admin-card-description">{car.description.substring(0, 80)}...</p>

                <div className="admin-card-actions">
                  <button 
                    className="admin-btn-icon admin-btn-edit" 
                    onClick={() => handleEdit(car)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="admin-btn-icon admin-btn-delete" 
                    onClick={() => handleDelete(car.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {cars.length === 0 && (
            <div className="admin-empty-state">
              <p>No cars found. Add your first listing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cars;
