import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '../api';
import { getToken } from '../utils';

export default function FoodPreferences() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Fetch foods, categories, and cuisines in parallel
      const [foodsResponse, categoriesResponse, cuisinesResponse] = await Promise.all([
        apiGet('/foods', token),
        apiGet('/foods/categories', token),
        apiGet('/foods/cuisines', token)
      ]);
      
      setFoods(foodsResponse);
      setCategories(categoriesResponse);
      setCuisines(cuisinesResponse);
    } catch (err) {
      setError('Failed to load food data');
      console.error('Error fetching food data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFoodPreference = async (food) => {
    try {
      const token = getToken();
      
      if (food.isSelected) {
        await apiDelete(`/foods/${food.id}/prefer`, token);
      } else {
        await apiPost(`/foods/${food.id}/prefer`, {}, token);
      }
      
      // Update local state
      setFoods(foods.map(f => 
        f.id === food.id ? { ...f, isSelected: !f.isSelected } : f
      ));
    } catch (err) {
      console.error('Error toggling food preference:', err);
      setError('Failed to update food preference');
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesCategory = !selectedCategory || food.category === selectedCategory;
    const matchesCuisine = !selectedCuisine || food.cuisine === selectedCuisine;
    const matchesSearch = !searchTerm || 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesCuisine && matchesSearch;
  });

  const selectedFoods = foods.filter(food => food.isSelected);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading food preferences...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Food Preferences</h1>
            <p className="text-gray-600 text-lg">
              Select your favorite foods to get personalized recommendations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Foods
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              {/* Selected Count */}
              <div className="flex items-end">
                <div className="bg-blue-50 rounded-lg p-3 w-full text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedFoods.length}</div>
                  <div className="text-sm text-blue-700">Selected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <div
                key={food.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:scale-105 cursor-pointer ${
                  food.isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => toggleFoodPreference(food)}
              >
                {/* Food Image */}
                <div className="relative h-48 bg-gray-200">
                  {food.imageUrl ? (
                    <img 
                      src={food.imageUrl} 
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Selection indicator */}
                  {food.isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Food badges */}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {food.isVegetarian && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Veg
                      </span>
                    )}
                    {food.isVegan && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        Vegan
                      </span>
                    )}
                    {food.isSpicy && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Spicy
                      </span>
                    )}
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {food.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{food.category}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{food.cuisine}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No foods found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
