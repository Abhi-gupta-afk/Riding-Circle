import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { apiPost } from '../api';
import { getToken, isAdmin } from '../utils';

export default function AddClub() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    city: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      setError('Access denied. Only administrators can create clubs.');
      return;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        setError('You must be logged in to create a club');
        setLoading(false);
        return;
      }

      if (!isAdmin()) {
        setError('Access denied. Only administrators can create clubs.');
        setLoading(false);
        return;
      }

      const response = await apiPost('/clubs', form, token);
      
      setSuccess('Club created successfully!');
      setTimeout(() => {
        navigate(`/clubs/${response.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to create club. Please check your inputs and try again.');
      console.error('Club creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
              <i className="fas fa-users text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Create New Club
            </h1>
            <p className="text-gray-600 text-lg">Build a community of passionate riders</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="fas fa-motorcycle text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Club Information</h2>
                  <p className="text-purple-100">Enter details about your riding club</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {error && (
                <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-400 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-exclamation-triangle text-red-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">Error</h4>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-6 bg-green-50 border-l-4 border-green-400 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-green-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Success!</h4>
                      <p className="text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Club Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-tag text-purple-600 mr-2"></i>
                      Club Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                      placeholder="e.g., Highway Riders Club"
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-motorcycle text-blue-600 mr-2"></i>
                      Motorcycle Brand *
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                      placeholder="e.g., Harley-Davidson, Honda, Yamaha"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-3">
                    <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg"
                    placeholder="e.g., Los Angeles, New York, Miami"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3">
                    <i className="fas fa-align-left text-yellow-600 mr-2"></i>
                    Club Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg resize-none"
                    placeholder="Describe your club's mission, values, riding style, and what makes it special. What kind of riders are you looking for?"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading || error?.includes('Access denied')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Creating Club...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fas fa-plus-circle"></i>
                        <span>Create Riding Club</span>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <i className="fas fa-arrow-left"></i>
                      <span>Cancel</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
