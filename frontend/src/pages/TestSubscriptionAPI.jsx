import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestSubscriptionAPI = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing subscription API...');
        
        // Test direct API call
        const response = await axios.get('/api/subscriptions/plans');
        console.log('API Response:', response);
        console.log('Plans data:', response.data);
        
        setPlans(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Subscription API...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Subscription API Test</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Success!</h3>
          <p>API call successful. Found {plans.length} plans.</p>
        </div>
      )}

      <div className="grid gap-4">
        {plans.map((plan, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold">{plan.displayName}</h3>
            <p className="text-gray-600">Price: ₹{plan.price}</p>
            <p className="text-gray-600">Duration: {plan.durationDays} days</p>
            <p className="text-gray-600">Max Trips: {plan.maxTrips}</p>
            <p className="text-gray-600">Max Clubs: {plan.maxClubs}</p>
            <p className="text-gray-600">Analytics: {plan.hasAnalytics ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Raw JSON Response:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(plans, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestSubscriptionAPI;
