import React, { useState, useEffect } from 'react';
import { addApartment, updateApartment } from '../services/dataService';
import { Image, Upload, X, Loader2 } from 'lucide-react';

const ApartmentForm = ({ onSuccess, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    images: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        images: initialData.images || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const currentImageCount = (formData.images ? formData.images.length : 0) + images.length;
      if (currentImageCount + newImages.length > 4) {
        alert("You can only have a maximum of 4 images.");
        return;
      }
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await updateApartment(initialData.id, formData, images);
        alert('Apartment updated successfully!');
      } else {
        await addApartment(formData, images);
        alert('Apartment added successfully!');
      }
      
      setFormData({
        name: '',
        price: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
        images: []
      });
      setImages([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(initialData ? 'Failed to update apartment.' : 'Failed to add apartment.');
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
            <span>{initialData ? 'Add More Images' : 'Upload Images'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <div className="image-previews">
            {/* Existing Images */}
            {formData.images && formData.images.map((url, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <img src={url} alt={`Existing ${index + 1}`} />
                <button type="button" onClick={() => removeExistingImage(index)} className="remove-img-btn">
                  <X size={14} />
                </button>
              </div>
            ))}
            {/* New Images */}
            {images.map((file, index) => (
              <div key={`new-${index}`} className="image-preview">
                <img src={URL.createObjectURL(file)} alt={`preview ${index}`} />
                <button type="button" onClick={() => removeNewImage(index)} className="remove-img-btn">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="spinner" size={20} />
            {initialData ? ' Updating...' : ' Adding...'}
          </>
        ) : (
          initialData ? 'Update Apartment' : 'Add Apartment'
        )}
      </button>
    </form>
  );
};

export default ApartmentForm;
