import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionPlans = () => {
  const { 
    availablePlans, 
    userSubscription, 
    loading, 
    subscribeToPlan, 
    getCurrentPlan,
    isSubscriptionActive,
    getDaysRemaining 
  } = useSubscription();
  
  const [processingPlan, setProcessingPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CREDIT_CARD');

  const handleSubscribe = async (planId) => {
    try {
      setProcessingPlan(planId);
      await subscribeToPlan(planId, selectedPaymentMethod);
      alert('Subscription successful! Welcome to your new plan.');
    } catch (error) {
      alert('Subscription failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingPlan(null);
    }
  };

  const currentPlan = getCurrentPlan();
  const daysRemaining = getDaysRemaining();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // Debug: Show what we have
  console.log('Available plans:', availablePlans);
  console.log('Loading state:', loading);
  console.log('Current plan:', currentPlan);

  if (!availablePlans || availablePlans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No subscription plans available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of RideCircle with our premium features
          </p>
          
          {/* Current Subscription Status */}
          {isSubscriptionActive() && currentPlan && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-crown text-blue-600 dark:text-blue-400"></i>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Current Plan: {currentPlan.displayName}
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                {daysRemaining} days remaining
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        {!isSubscriptionActive() && (
          <div className="mb-8 text-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="mx-auto block w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="PAYPAL">PayPal</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {availablePlans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const isProcessing = processingPlan === plan.id;
            const isFree = plan.name === 'FREE';
            const isPremium = plan.name === 'PREMIUM';
            const isEnterprise = plan.name === 'ENTERPRISE';

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  isPremium ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPremium && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Icon */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl ${
                      isFree ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      isPremium ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    }`}>
                      <i className={`fas ${
                        isFree ? 'fa-rocket' :
                        isPremium ? 'fa-star' :
                        'fa-crown'
                      }`}></i>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.displayName}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      {!isFree && (
                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                          /month
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center">
                      <i className="fas fa-check text-green-500 w-4 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {plan.maxTrips === 100 ? 'Unlimited' : plan.maxTrips} trips per month
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check text-green-500 w-4 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {plan.maxClubs === 50 ? 'Unlimited' : plan.maxClubs} clubs to join
                      </span>
                    </div>
                    {plan.hasAnalytics && (
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 w-4 mr-3"></i>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Advanced analytics
                        </span>
                      </div>
                    )}
                    {plan.hasPrioritySupport && (
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 w-4 mr-3"></i>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Priority support
                        </span>
                      </div>
                    )}
                    {plan.hasAdvancedFilters && (
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 w-4 mr-3"></i>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Advanced search filters
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : isFree
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : isPremium
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : isFree ? (
                      'Get Started Free'
                    ) : (
                      'Upgrade Now'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Feature Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Free
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Monthly Trips
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    25
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Club Memberships
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Analytics Dashboard
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-times text-red-500"></i>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-check text-green-500"></i>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-check text-green-500"></i>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Priority Support
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-times text-red-500"></i>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-check text-green-500"></i>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <i className="fas fa-check text-green-500"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
