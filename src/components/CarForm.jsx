import React, { useState } from 'react';
import { addCar } from '../services/dataService';
import { Upload, X } from 'lucide-react';

const CarForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    model: '',
    transmission: 'Automatic',
    airConditioning: 'Yes',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCar(formData, images);
      setFormData({
        name: '',
        price: '',
        model: '',
        transmission: 'Automatic',
        airConditioning: 'Yes',
        description: '',
      });
      setImages([]);
      if (onSuccess) onSuccess();
      alert('Car added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add car.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label>Car Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Toyota RAV4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price (GNF/Day)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="e.g. 300000"
          />
        </div>
        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="e.g. 2022"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Transmission</label>
          <select name="transmission" value={formData.transmission} onChange={handleChange}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div className="form-group">
          <label>Air Conditioning</label>
          <select name="airConditioning" value={formData.airConditioning} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Describe the car..."
        ></textarea>
      </div>

      <div className="form-group">
        <label>Images (Max 4)</label>
        <div className="image-upload-container">
          <label className="upload-btn">
            <Upload size={20} />
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <div className="image-previews">
            {images.map((file, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(file)} alt={`preview ${index}`} />
                <button type="button" onClick={() => removeImage(index)} className="remove-img-btn">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;
