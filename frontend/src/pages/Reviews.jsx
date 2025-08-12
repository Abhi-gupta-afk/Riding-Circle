import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { getToken } from '../utils';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ comment: '', tripId: '', rating: 5 });
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet('/reviews')
      .then(setReviews)
      .catch(() => setError('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);
    try {
      const token = getToken();
      // Convert rating to number and tripId to number
      const reviewData = {
        ...form,
        rating: parseInt(form.rating),
        tripId: parseInt(form.tripId)
      };
      await apiPost('/reviews', reviewData, token);
      setSuccess('Review posted successfully!');
      setForm({ comment: '', tripId: '', rating: 5 });
      const updated = await apiGet('/reviews');
      setReviews(updated);
    } catch {
      setError('Failed to post review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Reviews...</h3>
          <p className="text-gray-600 dark:text-gray-400">Gathering community experiences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <i className="fas fa-star text-white text-3xl"></i>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Community Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto">
            Share your adventure experiences and discover what fellow riders think about amazing trips
          </p>
        </div>

        {/* Review Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="fas fa-pen-fancy text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Write a Review</h2>
                  <p className="text-green-100">Help others discover amazing adventures</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
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

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label htmlFor="tripId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      <i className="fas fa-route text-blue-600 mr-2"></i>
                      Trip ID
                    </label>
                    <input
                      type="text"
                      id="tripId"
                      name="tripId"
                      value={form.tripId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                      placeholder="Enter Trip ID (e.g., 1, 2, 3...)"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="rating" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      <i className="fas fa-star text-yellow-500 mr-2"></i>
                      Rating
                    </label>
                    <div className="flex items-center gap-4">
                      <select
                        id="rating"
                        name="rating"
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ Amazing (5 stars)</option>
                        <option value={4}>⭐⭐⭐⭐ Great (4 stars)</option>
                        <option value={3}>⭐⭐⭐ Good (3 stars)</option>
                        <option value={2}>⭐⭐ Fair (2 stars)</option>
                        <option value={1}>⭐ Poor (1 star)</option>
                      </select>
                      <div className="flex">
                        {renderStars(form.rating)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    <i className="fas fa-comment-alt text-green-600 mr-2"></i>
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg resize-none"
                    placeholder="Share your experience... What made this trip special? Any tips for future travelers?"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Publishing Review...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fas fa-paper-plane"></i>
                        <span>Publish Review</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Our Community Says</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Real experiences from real riders</p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-comments text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Be the first to share your adventure experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map(review => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* Review Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{review.userUsername || 'Anonymous'}</h3>
                          <p className="text-blue-100 text-sm">Verified Traveler</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fas fa-route text-blue-600"></i>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trip #{review.tripId}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">{review.comment}</p>
                    
                    {/* Review Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-1">
                          <i className="fas fa-thumbs-up text-gray-400 text-sm"></i>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Helpful</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
