import React, { useState, useEffect } from 'react';
import CarForm from '../components/CarForm';
import { getCars } from '../services/dataService';
import { Plus } from 'lucide-react';

const Cars = () => {
  const [showForm, setShowForm] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cars Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Car</>}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Add New Car</h2>
          <CarForm onSuccess={() => {
            setShowForm(false);
            fetchCars();
          }} />
        </div>
      )}

      <div className="content-area">
        {loading ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p className="empty-state">No cars added yet.</p>
        ) : (
          <div className="items-grid">
            {cars.map((car) => (
              <div key={car.id} className="item-card">
                <div className="card-image">
                  {car.images && car.images.length > 0 ? (
                    <img src={car.images[0]} alt={car.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="card-details">
                  <h3>{car.name}</h3>
                  <p className="price">{Number(car.price).toLocaleString()} GNF/Day</p>
                  <div className="specs">
                    <span>{car.model}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                    <span>•</span>
                    <span>A/C: {car.airConditioning}</span>
                  </div>
                  <p className="description">{car.description.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
