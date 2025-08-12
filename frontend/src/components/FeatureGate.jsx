import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

const FeatureGate = ({ 
  feature, 
  children, 
  fallback, 
  showUpgradePrompt = true,
  className = '' 
}) => {
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hasFeatureAccess, getCurrentPlan } = useSubscription();

  React.useEffect(() => {
    const checkAccess = async () => {
      try {
        const access = await hasFeatureAccess(feature);
        setHasAccess(access);
      } catch (error) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [feature, hasFeatureAccess]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const currentPlan = getCurrentPlan();
  const isFreePlan = !currentPlan || currentPlan.name === 'FREE';

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center ${className}`}>
      <div className="mb-4">
        <i className="fas fa-lock text-3xl text-blue-600 dark:text-blue-400 mb-2"></i>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Premium Feature
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          This feature is available for {isFreePlan ? 'Premium and Enterprise' : 'Enterprise'} subscribers.
        </p>
      </div>
      
      <button
        onClick={() => window.location.href = '/subscription-plans'}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        <i className="fas fa-arrow-up mr-2"></i>
        Upgrade Now
      </button>
    </div>
  );
};

export default FeatureGate;
