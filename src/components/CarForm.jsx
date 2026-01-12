import React, { useState, useEffect } from 'react';
import { addCar, updateCar } from '../services/dataService';
import { Upload, X, Loader2 } from 'lucide-react';

const CarForm = ({ onSuccess, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    model: '',
    transmission: 'Automatic',
    airConditioning: 'Yes',
    description: '',
    images: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        model: initialData.model || '',
        transmission: initialData.transmission || 'Automatic',
        airConditioning: initialData.airConditioning || 'Yes',
        description: initialData.description || '',
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
        await updateCar(initialData.id, formData, images);
        alert('Car updated successfully!');
      } else {
        await addCar(formData, images);
        alert('Car added successfully!');
      }

      setFormData({
        name: '',
        price: '',
        model: '',
        transmission: 'Automatic',
        airConditioning: 'Yes',
        description: '',
        images: []
      });
      setImages([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(initialData ? 'Failed to update car.' : 'Failed to add car.');
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
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => removeExistingImage(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* New Images */}
            {images.map((file, index) => (
              <div key={`new-${index}`} className="image-preview">
                <img src={URL.createObjectURL(file)} alt={`new ${index}`} />
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
          initialData ? 'Update Car' : 'Add Car'
        )}
      </button>
    </form>
  );
};

export default CarForm;
