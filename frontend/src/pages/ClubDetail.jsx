import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { apiGet, apiDelete } from '../api';
import { isAdmin } from '../utils';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiGet(`/clubs/${id}`)
      .then(setClub)
      .catch(() => setError('Failed to load club'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/clubs/${id}`);
      navigate('/clubs');
    } catch (err) {
      setError('Failed to delete club');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Club Details...</h3>
          <p className="text-gray-600">Discovering club information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
  }

  if (!club) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        
        <div className="max-w-4xl mx-auto">
          {/* Club Hero Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                {/* Club Avatar */}
                <div className="w-32 h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-4xl">
                    {club.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Club Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl font-bold mb-4">{club.name}</h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      <i className="fas fa-motorcycle mr-2"></i>
                      {club.brand}
                    </span>
                  </div>
                  
                  {/* Admin Actions in Header */}
                  {isAdmin() && (
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                      <Link
                        to={`/clubs/${club.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                        Edit Club
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Club Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-blue-600"></i>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Location</p>
                      <p className="text-gray-900 font-bold">{club.city}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-400">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-crown text-purple-600"></i>
                    </div>
                    <div>
                      <p className="text-purple-600 font-medium text-sm uppercase tracking-wide">Owner</p>
                      <p className="text-gray-900 font-bold">{club.ownerUsername || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-info-circle text-green-600"></i>
                  </div>
                  About This Club
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl">{club.description}</p>
              </div>

              {/* Club Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center bg-blue-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-users text-blue-600"></i>
                  </div>
                  <p className="text-xl font-bold text-gray-900">156</p>
                  <p className="text-gray-600 text-xs">Members</p>
                </div>
                <div className="text-center bg-green-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-route text-green-600"></i>
                  </div>
                  <p className="text-xl font-bold text-gray-900">42</p>
                  <p className="text-gray-600 text-xs">Trips</p>
                </div>
                <div className="text-center bg-yellow-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-yellow-600"></i>
                  </div>
                  <p className="text-xl font-bold text-gray-900">4.8</p>
                  <p className="text-gray-600 text-xs">Rating</p>
                </div>
                <div className="text-center bg-purple-50 p-4 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-award text-purple-600"></i>
                  </div>
                  <p className="text-xl font-bold text-gray-900">5</p>
                  <p className="text-gray-600 text-xs">Years</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Club Trips</h4>
                  <p className="text-gray-600 text-sm">View all trips organized by this club</p>
                </div>
              </div>
              <Link 
                to={`/clubs/${club.id}/trips`} 
                className="btn-primary w-full group-hover:transform group-hover:scale-105 transition-transform"
              >
                Browse Trips
              </Link>
            </div>

            <div className="card group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Add Trip</h4>
                  <p className="text-gray-600 text-sm">Create a new adventure for this club</p>
                </div>
              </div>
              <Link 
                to={`/clubs/${club.id}/trips/add`} 
                className="btn-secondary w-full group-hover:transform group-hover:scale-105 transition-transform"
              >
                Create Trip
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Club Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Club ID</span>
                <span className="text-gray-900">#{club.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Brand Focus</span>
                <span className="text-gray-900">{club.brand}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Location</span>
                <span className="text-gray-900">{club.city}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-700">Club Owner</span>
                <span className="text-gray-900">{club.ownerUsername || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Club</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{club.name}"? This will permanently remove the club and all associated trips.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 btn-error flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Club'
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
