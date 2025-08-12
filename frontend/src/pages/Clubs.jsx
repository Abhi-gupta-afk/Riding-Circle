import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiDelete } from '../api';
import { isAdmin } from '../utils';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, club: null });
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberships, setMemberships] = useState({});

  useEffect(() => {
    fetchClubs();
    checkUserMemberships();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await apiGet('/clubs');
      setClubs(data);
    } catch (err) {
      setError('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const checkUserMemberships = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('/api/clubs/my-clubs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userClubs = await response.json();
      const membershipMap = {};
      userClubs.forEach(club => {
        membershipMap[club.id] = true;
      });
      setMemberships(membershipMap);
    } catch (error) {
      console.error('Error checking memberships:', error);
    }
  };

  const handleDelete = async (clubId) => {
    setDeleting(true);
    try {
      await apiDelete(`/clubs/${clubId}`);
      setClubs(clubs.filter(club => club.id !== clubId));
      setDeleteModal({ show: false, club: null });
    } catch (err) {
      setError('Failed to delete club');
    } finally {
      setDeleting(false);
    }
  };

  const joinClub = async (clubId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to join clubs');
      return;
    }

    try {
      const response = await fetch(`/api/clubs/${clubId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setMemberships(prev => ({ ...prev, [clubId]: true }));
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error joining club:', error);
      alert('Failed to join club');
    }
  };

  const leaveClub = async (clubId) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/clubs/${clubId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setMemberships(prev => ({ ...prev, [clubId]: false }));
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error('Error leaving club:', error);
      alert('Failed to leave club');
    }
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'joined') return matchesSearch && memberships[club.id];
    if (filter === 'available') return matchesSearch && !memberships[club.id];
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Riding Clubs</h1>
            <p className="text-gray-600 text-lg">Discover and join amazing riding communities</p>
          </div>
          {isAdmin() && (
            <Link 
              to="/clubs/add" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Create Club
            </Link>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search clubs..."
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
                All Clubs
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
                onClick={() => setFilter('joined')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'joined' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                My Clubs
              </button>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600 mb-6">Be the first to create a riding club!</p>
            {isAdmin() && (
              <Link 
                to="/clubs/add" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>
                Create First Club
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <div key={club.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Club Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {club.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {isAdmin() && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/clubs/${club.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Club"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, club })}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Club"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {club.name}
                  </h3>

                  {/* Club Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <i className="fas fa-map-marker-alt text-gray-400 w-5"></i>
                      <span className="font-medium">{club.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <i className="fas fa-motorcycle text-gray-400 w-5"></i>
                      <span>{club.brand}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">{club.description}</p>
                  </div>

                  {/* Club Footer */}
                  <div className="space-y-3">
                    {/* Membership Buttons */}
                    {memberships[club.id] ? (
                      <div className="flex gap-2">
                        <span className="flex-1 bg-green-100 text-green-800 text-center py-2 px-4 rounded-lg font-medium">
                          ✓ Member
                        </span>
                        <button
                          onClick={() => leaveClub(club.id)}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          Leave Club
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => joinClub(club.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Join Club
                      </button>
                    )}
                    
                    {/* View Details */}
                    <div className="flex gap-3">
                      <Link
                        to={`/clubs/${club.id}`}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/clubs/${club.id}/trips/add`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                        title="Add Trip"
                      >
                        <i className="fas fa-plus"></i>
                      </Link>
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
                  <i className="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Club</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{deleteModal.club?.name}"? This will also delete all associated trips and data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, club: null })}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.club.id)}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
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
