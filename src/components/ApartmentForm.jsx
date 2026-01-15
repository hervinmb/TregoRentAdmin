import React, { useState, useEffect } from 'react';
import { addApartment, updateApartment, getApartments } from '../services/dataService';
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
    place: '',
    category: '',
    contactLink: '',
    images: []
  });
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        place: initialData.place || '',
        category: initialData.category || '',
        contactLink: initialData.contactLink || '',
        images: initialData.images || []
      });
    }
  }, [initialData]);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const apartments = await getApartments();
        const uniquePlaces = Array.from(
          new Set(
            apartments
              .map(apartment => apartment.place)
              .filter(Boolean)
          )
        );
        setAvailablePlaces(uniquePlaces);
      } catch (error) {
        console.error('Failed to load places for suggestions:', error);
      }
    };

    loadPlaces();
  }, []);

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
        place: '',
        category: '',
        contactLink: '',
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

      <div className="form-row">
        <div className="form-group">
          <label>Place</label>
          <input
            type="text"
            name="place"
            list="place-options"
            value={formData.place}
            onChange={handleChange}
            placeholder="e.g. Conakry, Miami, Paris"
          />
          <datalist id="place-options">
            {availablePlaces.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="entire house">entire house</option>
            <option value="guest room">guest room</option>
            <option value="apartment">apartment</option>
            <option value="hotel">hotel</option>
            <option value="room in a lodge">room in a lodge</option>
            <option value="apartment in a lodge">apartment in a lodge</option>
          </select>
        </div>
        <div className="form-group">
          <label>Contact link (optional)</label>
          <input
            type="url"
            name="contactLink"
            value={formData.contactLink}
            onChange={handleChange}
            placeholder="https://example.com/booking"
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
