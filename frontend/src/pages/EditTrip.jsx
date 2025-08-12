import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPut } from '../api';
import BackButton from '../components/BackButton';

export default function EditTrip() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [tripType, setTripType] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const trip = await apiGet(`/trips/${id}`);
        setTitle(trip.title);
        setDescription(trip.description);
        setStartLocation(trip.startLocation);
        setEndLocation(trip.endLocation);
        setStartTime(trip.startTime);
        setTripType(trip.tripType);
      } catch (err) {
        setError('Failed to load trip details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await apiPut(`/trips/${id}`, {
        title,
        description,
        startLocation,
        endLocation,
        startTime,
        tripType
      });
      setSuccess(true);
      setTimeout(() => navigate(`/trips/${id}`), 2000);
    } catch (err) {
      setError('Failed to update trip. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading trip details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <i className="fas fa-edit text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Edit Trip
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Update your trip details</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/20 backdrop-blur border border-green-200/50 dark:border-green-700/50 rounded-2xl animate-fade-in-up">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                    Trip updated successfully! Redirecting to trip details...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur border border-red-200/50 dark:border-red-700/50 rounded-2xl animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Title */}
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Trip Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter trip title..."
                />
              </div>

              {/* Description */}
              <div className="group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                  <i className="fas fa-align-left mr-2"></i>
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Describe your trip..."
                />
              </div>

              {/* Location Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="startLocation" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                    <i className="fas fa-play mr-2"></i>
                    Start Location
                  </label>
                  <input
                    type="text"
                    id="startLocation"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Starting point..."
                  />
                </div>

                <div className="group">
                  <label htmlFor="endLocation" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                    <i className="fas fa-flag-checkered mr-2"></i>
                    End Location
                  </label>
                  <input
                    type="text"
                    id="endLocation"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Destination..."
                  />
                </div>
              </div>

              {/* Date & Time and Trip Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                    <i className="fas fa-clock mr-2"></i>
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="group">
                  <label htmlFor="tripType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 transition-colors">
                    <i className="fas fa-tags mr-2"></i>
                    Trip Type
                  </label>
                  <select
                    id="tripType"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">Select trip type...</option>
                    <option value="WEEKEND_GETAWAY">Weekend Getaway</option>
                    <option value="ONE_DAY_RIDE">One Day Ride</option>
                    <option value="MULTI_DAY_TOUR">Multi Day Tour</option>
                    <option value="CHARITY_RIDE">Charity Ride</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Updating Trip...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-save mr-3"></i>
                      Update Trip
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
