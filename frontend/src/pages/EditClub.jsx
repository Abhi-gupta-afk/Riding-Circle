import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPut } from '../api';
import BackButton from '../components/BackButton';

export default function EditClub() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadClub = async () => {
      try {
        const club = await apiGet(`/clubs/${id}`);
        setName(club.name);
        setDescription(club.description);
        setBrand(club.brand);
        setCity(club.city);
      } catch (err) {
        setError('Failed to load club details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadClub();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiPut(`/clubs/${id}`, { name, description, brand, city });
      setSuccess(true);
      setTimeout(() => navigate(`/clubs/${id}`), 2000);
    } catch (err) {
      setError('Failed to update club. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading club details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="text-center mb-8 animate-fade-in-down">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-105 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Edit Club
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Update your club details</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/20 backdrop-blur border border-green-200/50 dark:border-green-700/50 rounded-2xl animate-fade-in-up">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 text-xl"></i>
                <span className="ml-3 text-green-700 dark:text-green-400 text-sm font-medium">
                  Club updated successfully! Redirecting to club details...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur border border-red-200/50 dark:border-red-700/50 rounded-2xl animate-shake">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                <span className="ml-3 text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-flag mr-2"></i> Club Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  placeholder="Enter club name..."
                />
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-align-left mr-2"></i> Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none"
                  placeholder="Describe your club..."
                />
              </div>

              <div className="group">
                <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-motorcycle mr-2"></i> Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  placeholder="Enter brand..."
                />
              </div>

              <div className="group">
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-city mr-2"></i> City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  placeholder="Enter city..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Updating Club...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-save mr-3"></i> Update Club
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
