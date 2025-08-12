import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiDelete } from '../api';
import { isAdmin } from '../utils';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, trip: null });
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState({});

  useEffect(() => {
    fetchTrips();
    checkUserRegistrations();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await apiGet('/trips');
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistrations = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('/api/trips/my-trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userTrips = await response.json();
      const registrationMap = {};
      userTrips.forEach(trip => {
        registrationMap[trip.id] = true;
      });
      setRegistrations(registrationMap);
    } catch (error) {
      console.error('Error checking registrations:', error);
    }
  };

  const handleDelete = async (tripId) => {
    setDeleting(true);
    try {
      await apiDelete(`/trips/${tripId}`);
      setTrips(trips.filter(trip => trip.id !== tripId));
      setDeleteModal({ show: false, trip: null });
    } catch (err) {
      setError('Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  const registerForTrip = async (tripId, plan = 'NORMAL') => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to register for trips');
      return;
    }

    try {
      const response = await fetch(`/api/trips/${tripId}/register?plan=${plan}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setRegistrations(prev => ({ ...prev, [tripId]: true }));
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error registering for trip:', error);
      alert('Failed to register for trip');
    }
  };

  const unregisterFromTrip = async (tripId) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/trips/${tripId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setRegistrations(prev => ({ ...prev, [tripId]: false }));
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error unregistering from trip:', error);
      alert('Failed to unregister from trip');
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'registered') return matchesSearch && registrations[trip.id];
    if (filter === 'available') return matchesSearch && !registrations[trip.id];
    
    return matchesSearch && trip.tripType === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading Amazing Trips...</div>
          <p className="text-gray-500 mt-2">Discovering your next adventure</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <p className="text-gray-500">Something went wrong while loading trips</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg mt-4 transition-colors duration-200"
          >
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              <i className="fas fa-route mr-3"></i>
              Epic Adventures Await
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover incredible riding adventures, join thrilling expeditions, and create unforgettable memories with fellow bikers
            </p>
            {isAdmin() && (
              <Link 
                to="/trips/add" 
                className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <i className="fas fa-plus mr-2"></i>
                Create New Adventure
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <i className="fas fa-route"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900">{trips.length}</div>
            <div className="text-gray-600">Available Trips</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-2">
              <i className="fas fa-users"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-gray-600">Adventure Seekers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              <i className="fas fa-star"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Trips
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilter('registered')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'registered' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                My Trips
              </button>
              <button
                onClick={() => setFilter('WEEKEND_GETAWAY')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'WEEKEND_GETAWAY' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Weekend Getaway
              </button>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-route text-5xl text-blue-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Adventures Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Ready to embark on your first epic journey? Create an adventure that others will remember forever!</p>
            {isAdmin() && (
              <Link 
                to="/trips/add" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Your First Adventure
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                {/* Trip Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-3">
                          <i className="fas fa-route mr-1"></i>
                          {trip.tripType}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">
                          {trip.title}
                        </h3>
                      </div>
                      {isAdmin() && (
                        <div className="flex gap-2">
                          <Link
                            to={`/trips/${trip.id}/edit`}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                            title="Edit Trip"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, trip })}
                            className="p-2 text-white/80 hover:text-white hover:bg-red-500/30 rounded-lg transition-all duration-200"
                            title="Delete Trip"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trip Content */}
                <div className="p-6">
                  {/* Trip Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{trip.description}</p>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Start Location</p>
                        <p className="font-semibold text-gray-900">{trip.startLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-flag-checkered text-red-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-red-600 font-medium uppercase tracking-wide">End Location</p>
                        <p className="font-semibold text-gray-900">{trip.endLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-users text-blue-600"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-xs text-gray-600">Participants</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-route text-purple-600"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">250</p>
                      <p className="text-xs text-gray-600">KM Distance</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-star text-yellow-600"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                  </div>

                  {/* Trip Footer */}
                  <div className="space-y-3">
                    {/* Registration Buttons */}
                    {registrations[trip.id] ? (
                      <div className="flex gap-2">
                        <span className="flex-1 bg-green-100 text-green-800 text-center py-3 px-4 rounded-lg font-medium">
                          ✓ Registered
                        </span>
                        <button
                          onClick={() => unregisterFromTrip(trip.id)}
                          className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          Leave Trip
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => registerForTrip(trip.id, 'NORMAL')}
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Join (Normal)
                        </button>
                        <button
                          onClick={() => registerForTrip(trip.id, 'PREMIUM')}
                          className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                        >
                          Join (Premium)
                        </button>
                      </div>
                    )}
                    
                    {/* View Details */}
                    <div className="flex gap-3">
                      <Link
                        to={`/trips/${trip.id}`}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-lg font-medium text-center hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        View Details
                      </Link>
                      <button 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all duration-200"
                        title="Quick Info"
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Trip</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{deleteModal.trip?.title}"? All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, trip: null })}
                  className="flex-1 btn-secondary"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.trip.id)}
                  disabled={deleting}
                  className="flex-1 btn-error flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Trip'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
