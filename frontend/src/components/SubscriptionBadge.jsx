import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionBadge = ({ className = '' }) => {
  const { getCurrentPlan, isSubscriptionActive, getDaysRemaining } = useSubscription();
  
  const currentPlan = getCurrentPlan();
  const isActive = isSubscriptionActive();
  const daysRemaining = getDaysRemaining();

  if (!currentPlan || !isActive) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ${className}`}>
        <i className="fas fa-user mr-1"></i>
        Free Plan
      </div>
    );
  }

  const getBadgeStyles = () => {
    switch (currentPlan.name) {
      case 'PREMIUM':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'ENTERPRISE':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getIcon = () => {
    switch (currentPlan.name) {
      case 'PREMIUM':
        return 'fa-star';
      case 'ENTERPRISE':
        return 'fa-crown';
      default:
        return 'fa-user';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles()} ${className}`}>
      <i className={`fas ${getIcon()} mr-1`}></i>
      {currentPlan.displayName}
      {daysRemaining <= 7 && (
        <span className="ml-1 text-orange-600 dark:text-orange-400">
          ({daysRemaining}d left)
        </span>
      )}
    </div>
  );
};

export default SubscriptionBadge;
