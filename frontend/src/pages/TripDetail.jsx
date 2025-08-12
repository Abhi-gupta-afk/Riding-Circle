import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { apiGet, apiPost, apiDelete } from '../api';
import { getToken, parseJwt, isAdmin } from '../utils';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerMsg, setRegisterMsg] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiGet(`/trips/${id}`)
      .then(setTrip)
      .catch(() => setError('Failed to load trip'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setRegisterMsg(null);
    try {
      const token = getToken();
      const user = parseJwt(token);
      if (!user || !user.id) {
        setRegisterMsg('You must be logged in.');
        return;
      }
      await apiPost('/registrations', { userId: user.id, tripId: id }, token);
      setRegisterMsg('Successfully registered for the trip!');
    } catch {
      setRegisterMsg('Registration failed.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/trips/${id}`);
      navigate('/trips');
    } catch (err) {
      setError('Failed to delete trip');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Trip Details...</h3>
        <p className="text-gray-600">Preparing your adventure details</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <i className="fas fa-refresh mr-2"></i>
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        
        {/* Trip Hero Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <span className="inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4">
                <i className="fas fa-route mr-2"></i>
                {trip.tripType}
              </span>
              <h1 className="text-4xl font-bold mb-4">{trip.title}</h1>
              <p className="text-blue-100 text-lg leading-relaxed">{trip.description}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Location Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-green-600 font-medium text-sm uppercase tracking-wide">Starting Point</p>
                    <p className="text-gray-900 font-bold text-lg">{trip.startLocation}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-flag-checkered text-red-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-red-600 font-medium text-sm uppercase tracking-wide">Destination</p>
                    <p className="text-gray-900 font-bold text-lg">{trip.endLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizing Club Section */}
            {trip.organizingClub && (
              <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-purple-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-purple-600 font-medium text-sm uppercase tracking-wide">Organized By</p>
                    <p className="text-gray-900 font-bold text-lg">{trip.organizingClub.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-blue-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-users text-blue-600"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-gray-600 text-sm">Participants</p>
              </div>
              <div className="text-center bg-yellow-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-route text-yellow-600"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">320</p>
                <p className="text-gray-600 text-sm">KM Distance</p>
              </div>
              <div className="text-center bg-green-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-star text-green-600"></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-gray-600 text-sm">Rating</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <i className="fas fa-user-plus mr-3"></i>
                Register for this Amazing Trip
              </button>

              {isAdmin() && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link 
                    to={`/trips/${trip.id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-medium text-center flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Trip
                  </Link>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete Trip
                  </button>
                </div>
              )}
            </div>

            {/* Success/Error Message */}
            {registerMsg && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600"></i>
                  </div>
                  <p className="text-green-800 font-medium">{registerMsg}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-gray-700 text-center">
                Are you sure you want to delete <span className="font-bold text-gray-900">"{trip?.title}"</span>?
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Delete Trip
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
