import React, { useState } from 'react';
import { addApartment } from '../services/dataService';
import { Image, Upload, X } from 'lucide-react';

const ApartmentForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
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
      await addApartment(formData, images);
      setFormData({
        name: '',
        price: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
      });
      setImages([]);
      if (onSuccess) onSuccess();
      alert('Apartment added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add apartment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label>Apartment Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Luxury Ocean View Suite"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price (GNF)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="e.g. 500000"
          />
        </div>
        <div className="form-group">
          <label>Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            placeholder="e.g. 2"
          />
        </div>
        <div className="form-group">
          <label>Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            placeholder="e.g. 1"
          />
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
          placeholder="Describe the apartment..."
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
        {loading ? 'Adding...' : 'Add Apartment'}
      </button>
    </form>
  );
};

export default ApartmentForm;
