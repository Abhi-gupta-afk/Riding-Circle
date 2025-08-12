import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { apiPost, apiGet } from '../api';
import { getToken, isAdmin } from '../utils';

export default function AddTrip() {
  const navigate = useNavigate();
  const { clubId } = useParams(); // Get club ID from URL if adding trip to specific club
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startLocation: '',
    endLocation: '',
    startTime: '',
    tripType: 'ONE_DAY_RIDE',
    selectedClubId: clubId || ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Trip type options matching backend enum
  const tripTypes = [
    { value: 'ONE_DAY_RIDE', label: 'One Day Ride' },
    { value: 'WEEKEND_GETAWAY', label: 'Weekend Getaway' },
    { value: 'MULTI_DAY_TOUR', label: 'Multi Day Tour' },
    { value: 'CHARITY_RIDE', label: 'Charity Ride' }
  ];

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      setError('Access denied. Only administrators can create trips.');
      return;
    }

    // Load clubs for selection
    const loadClubs = async () => {
      try {
        const clubsData = await apiGet('/clubs');
        setClubs(clubsData);
        if (!clubId && clubsData.length > 0) {
          setForm(prev => ({ ...prev, selectedClubId: clubsData[0].id }));
        }
      } catch (err) {
        console.error('Failed to load clubs:', err);
      }
    };
    loadClubs();
  }, [clubId]);

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
        setError('You must be logged in to create a trip');
        setLoading(false);
        return;
      }

      // Format the datetime for backend (ISO format)
      const tripData = {
        title: form.title,
        description: form.description,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        startTime: new Date(form.startTime).toISOString(),
        tripType: form.tripType
      };

      const clubIdToUse = form.selectedClubId;
      const response = await apiPost(`/clubs/${clubIdToUse}/trips`, tripData, token);
      
      setSuccess('Trip created successfully!');
      setTimeout(() => {
        navigate(`/trips/${response.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to create trip. Please check your inputs and try again.');
      console.error('Trip creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <i className="fas fa-plus text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Create Amazing Trip
            </h1>
            <p className="text-gray-600 text-lg">Plan your next adventure and invite fellow riders</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="fas fa-route text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Trip Details</h2>
                  <p className="text-green-100">Fill in the information about your upcoming adventure</p>
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
                {/* Basic Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-tag text-blue-600 mr-2"></i>
                      Trip Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                      placeholder="e.g., Mountain Adventure Ride"
                    />
                  </div>

                  <div>
                    <label htmlFor="tripType" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-list text-purple-600 mr-2"></i>
                      Trip Type *
                    </label>
                    <select
                      id="tripType"
                      name="tripType"
                      value={form.tripType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg bg-white"
                    >
                      {tripTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3">
                    <i className="fas fa-align-left text-green-600 mr-2"></i>
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg resize-none"
                    placeholder="Describe the trip route, highlights, difficulty level, and what participants should expect..."
                  />
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startLocation" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
                      Start Location *
                    </label>
                    <input
                      type="text"
                      id="startLocation"
                      name="startLocation"
                      value={form.startLocation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg"
                      placeholder="e.g., Central Park, New York"
                    />
                  </div>

                  <div>
                    <label htmlFor="endLocation" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-flag-checkered text-red-600 mr-2"></i>
                      End Location *
                    </label>
                    <input
                      type="text"
                      id="endLocation"
                      name="endLocation"
                      value={form.endLocation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 text-lg"
                      placeholder="e.g., Brooklyn Bridge, New York"
                    />
                  </div>
                </div>

                {/* Date & Club */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-clock text-yellow-600 mr-2"></i>
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      min={getMinDateTime()}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="selectedClubId" className="block text-sm font-bold text-gray-700 mb-3">
                      <i className="fas fa-users text-blue-600 mr-2"></i>
                      Organizing Club *
                    </label>
                    <select
                      id="selectedClubId"
                      name="selectedClubId"
                      value={form.selectedClubId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg bg-white"
                    >
                      <option value="">Select a Club</option>
                      {clubs.map(club => (
                        <option key={club.id} value={club.id}>
                          {club.name} - {club.brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Creating Trip...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fas fa-plus-circle"></i>
                        <span>Create Amazing Trip</span>
                      </div>
                    )}
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
