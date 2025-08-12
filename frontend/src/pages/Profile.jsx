import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { apiGet } from '../api';
import { getToken, isAdmin } from '../utils';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = getToken();
      
      // Fetch user profile, food preferences, restaurant bookings, trips, and clubs in parallel
      const [userResponse, foodPrefsResponse, bookingsResponse, tripsResponse, clubsResponse] = await Promise.all([
        apiGet('/users/me', token),
        apiGet('/foods/preferences', token).catch(() => []),
        apiGet('/restaurant-bookings/my-bookings', token).catch(() => []),
        fetch('/api/trips/my-trips', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : []).catch(() => []),
        fetch('/api/clubs/my-clubs', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : []).catch(() => [])
      ]);
      
      setUser(userResponse);
      setFoodPreferences(foodPrefsResponse);
      setRestaurantBookings(bookingsResponse);
      setUserTrips(tripsResponse);
      setUserClubs(clubsResponse);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBookingStatus = (status) => {
    const statusConfig = {
      CONFIRMED: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', text: 'Completed' }
    };
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="container py-20">
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="text-red-600 text-lg">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <BackButton className="mb-6" />
        
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                <p className="text-gray-600 text-lg">{user.email}</p>
                {isAdmin() && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.012-3.77l-.867-.5A2.5 2.5 0 0015.586 9H10.5a2.5 2.5 0 00-2.449 2.002L8 11.5l-.051.498a2.5 2.5 0 00-2.449 2.002L5.449 14H2a1 1 0 000 2v0a1 1 0 001 1h3.449a2.5 2.5 0 002.449 2.002L9 19.5l.051-.498A2.5 2.5 0 0011.5 21h5.086a2.5 2.5 0 001.559-.56l.867-.5a1 1 0 000-1.732z" />
                    </svg>
                    Administrator
                  </span>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {userClubs.length}
              </h3>
              <p className="text-gray-600">Clubs Joined</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {userTrips.length}
              </h3>
              <p className="text-gray-600">Trips Registered</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {user.reviews ? user.reviews.length : 0}
              </h3>
              <p className="text-gray-600">Reviews Written</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {foodPreferences.length}
              </h3>
              <p className="text-gray-600">Food Preferences</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {restaurantBookings.length}
              </h3>
              <p className="text-gray-600">Restaurant Bookings</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('food')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'food'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Food Preferences ({foodPreferences.length})
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Restaurant Bookings ({restaurantBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('trips')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'trips'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Trips ({userTrips.length})
                </button>
                <button
                  onClick={() => setActiveTab('clubs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'clubs'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Clubs ({userClubs.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Username</p>
                      <p className="text-gray-600">{user.username}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-gray-600">••••••••</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Account Type</p>
                      <p className="text-gray-600">
                        {isAdmin() ? 'Administrator Account' : 'Standard User Account'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Food Preferences</h2>
                <a
                  href="/food-preferences"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Manage Preferences
                </a>
              </div>
              
              {foodPreferences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foodPreferences.map(food => (
                    <div key={food.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                        <div className="flex gap-1">
                          {food.isVegetarian && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Veg
                            </span>
                          )}
                          {food.isSpicy && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Spicy
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{food.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{food.category}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{food.cuisine}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No food preferences yet</h3>
                  <p className="text-gray-600 mb-4">Start selecting your favorite foods to get personalized recommendations.</p>
                  <a href="/food-preferences" className="btn-primary">
                    Add Food Preferences
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Restaurant Bookings</h2>
                <a
                  href="/restaurants"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  New Booking
                </a>
              </div>
              
              {restaurantBookings.length > 0 ? (
                <div className="space-y-4">
                  {restaurantBookings.map(booking => {
                    const statusConfig = formatBookingStatus(booking.status);
                    return (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.restaurant.name}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                {statusConfig.text}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                <span>{formatDate(booking.bookingDate)} at {formatTime(booking.bookingTime)}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                </svg>
                                <span>{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>{booking.restaurant.address}, {booking.restaurant.city}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <span>{booking.restaurant.phoneNumber}</span>
                              </div>
                            </div>
                            
                            {booking.specialRequests && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {booking.status === 'CONFIRMED' && (
                              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                Cancel
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurant bookings yet</h3>
                  <p className="text-gray-600 mb-4">Book your first table at one of our partner restaurants.</p>
                  <a href="/restaurants" className="btn-primary">
                    Browse Restaurants
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === 'trips' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h2>
              
              {userTrips.length > 0 ? (
                <div className="space-y-4">
                  {userTrips.map((trip) => (
                    <div key={trip.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.title}</h3>
                          <p className="text-gray-600 mb-3">{trip.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              </svg>
                              <span>{trip.startLocation} → {trip.endLocation}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                              <span>{new Date(trip.startTime).toLocaleDateString()}</span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {trip.tripType}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Details
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Unregister
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No trips registered yet</h3>
                  <p className="text-gray-600 mb-4">Join exciting motorcycle trips and explore new destinations.</p>
                  <a href="/trips" className="btn-primary">
                    Browse Trips
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Clubs Tab */}
          {activeTab === 'clubs' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Clubs</h2>
              
              {userClubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userClubs.map((club) => (
                    <div key={club.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{club.name}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Member
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{club.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          </svg>
                          <span>{club.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                          </svg>
                          <span>{club.brand}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Club
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Leave Club
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs joined yet</h3>
                  <p className="text-gray-600 mb-4">Join motorcycle clubs and connect with fellow riders.</p>
                  <a href="/clubs" className="btn-primary">
                    Browse Clubs
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Danger Zone - Only show on profile tab */}
          {activeTab === 'profile' && (
            <div className="card border-red-200 bg-red-50 mt-8">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-red-700 text-sm">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button className="btn-error">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
