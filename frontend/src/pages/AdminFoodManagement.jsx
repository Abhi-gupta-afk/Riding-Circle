import React, { useState, useEffect } from 'react';
import './AdminFoodManagement.css';

const AdminFoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    cuisine: '',
    imageUrl: '',
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from localStorage
  const getAuthToken = () => localStorage.getItem('authToken');

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/api/admin/foods', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch foods');
      }

      const data = await response.json();
      setFoods(data);
    } catch (error) {
      setError('Failed to load foods: ' + error.message);
    }
  };

  // Add new food
  const handleAddFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/api/admin/foods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add food');
      }

      setSuccess('Food added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      setError('Failed to add food: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update food
  const handleUpdateFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8080/api/admin/foods/${selectedFood.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update food');
      }

      setSuccess('Food updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      setError('Failed to update food: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete food
  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8080/api/admin/foods/${foodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete food');
      }

      setSuccess('Food deleted successfully!');
      fetchFoods();
    } catch (error) {
      setError('Failed to delete food: ' + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      cuisine: '',
      imageUrl: '',
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      isActive: true
    });
    setSelectedFood(null);
  };

  // Open edit modal
  const openEditModal = (food) => {
    setSelectedFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price ? food.price.toString() : '',
      category: food.category || '',
      cuisine: food.cuisine || '',
      imageUrl: food.imageUrl || '',
      isVegetarian: food.isVegetarian || false,
      isVegan: food.isVegan || false,
      isSpicy: food.isSpicy || false,
      isActive: food.isActive !== undefined ? food.isActive : true
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="admin-food-management">
      <div className="admin-header">
        <h1>Food Management</h1>
        <button 
          className="add-food-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add New Food
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="foods-grid">
        {foods.map(food => (
          <div key={food.id} className="food-card">
            {food.imageUrl && (
              <img src={food.imageUrl} alt={food.name} className="food-image" />
            )}
            <div className="food-info">
              <h3>{food.name}</h3>
              <p className="food-description">{food.description}</p>
              <p className="food-category">Category: {food.category}</p>
              <p className="food-cuisine">Cuisine: {food.cuisine}</p>
              <p className="food-price">₹{food.price}</p>
              <div className="food-attributes">
                {food.isVegetarian && <span className="attribute veg">Vegetarian</span>}
                {food.isVegan && <span className="attribute vegan">Vegan</span>}
                {food.isSpicy && <span className="attribute spicy">Spicy</span>}
              </div>
              <p className={`food-status ${food.isActive ? 'active' : 'inactive'}`}>
                {food.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="food-actions">
              <button 
                className="edit-btn"
                onClick={() => openEditModal(food)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteFood(food.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Food</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddFood}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cuisine *</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Cuisine</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="American">American</option>
                  <option value="Thai">Thai</option>
                  <option value="Continental">Continental</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                  />
                  Vegetarian
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVegan"
                    checked={formData.isVegan}
                    onChange={handleInputChange}
                  />
                  Vegan
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleInputChange}
                  />
                  Spicy
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Food'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Food Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Food</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateFood}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cuisine *</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Cuisine</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="American">American</option>
                  <option value="Thai">Thai</option>
                  <option value="Continental">Continental</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                  />
                  Vegetarian
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVegan"
                    checked={formData.isVegan}
                    onChange={handleInputChange}
                  />
                  Vegan
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleInputChange}
                  />
                  Spicy
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Food'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoodManagement;
