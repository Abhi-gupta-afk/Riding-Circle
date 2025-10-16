import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
const API_BASE = 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: API_BASE
});

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch user's current subscription
  const fetchUserSubscription = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axiosInstance.get('/api/subscriptions/my-subscription', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSubscription(response.data);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      if (error.response?.status === 404) {
        setUserSubscription(null); // No subscription found
      }
    }
  };

  // Fetch available subscription plans
  const fetchAvailablePlans = async () => {
    try {
      console.log('Fetching subscription plans...');
      const response = await axiosInstance.get('/api/subscriptions/plans');
      console.log('Plans response:', response.data);
      setAvailablePlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to load subscription plans');
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId, paymentMethod = 'CREDIT_CARD') => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await axiosInstance.post('/api/subscriptions/subscribe', {
        planId,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchUserSubscription(); // Refresh subscription data
      return response.data;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      await axiosInstance.post('/api/subscriptions/cancel', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchUserSubscription(); // Refresh subscription data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has access to a feature
  const hasFeatureAccess = async (feature) => {
    try {
      const token = getAuthToken();
      if (!token) return false;

      const response = await axios.get(`/api/subscriptions/feature-access/${feature}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.hasAccess;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  // Get current plan details
  const getCurrentPlan = () => {
    if (!userSubscription || !availablePlans.length) return null;
    return availablePlans.find(plan => plan.id === userSubscription.planId);
  };

  // Check if subscription is active
  const isSubscriptionActive = () => {
    return userSubscription && userSubscription.status === 'ACTIVE' && 
           new Date(userSubscription.endDate) > new Date();
  };

  // Get days remaining in subscription
  const getDaysRemaining = () => {
    if (!userSubscription || !isSubscriptionActive()) return 0;
    const endDate = new Date(userSubscription.endDate);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  useEffect(() => {
    const initializeSubscriptionData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAvailablePlans(), fetchUserSubscription()]);
      } catch (error) {
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    initializeSubscriptionData();
  }, []);

  const value = {
    userSubscription,
    availablePlans,
    loading,
    error,
    subscribeToPlan,
    cancelSubscription,
    hasFeatureAccess,
    getCurrentPlan,
    isSubscriptionActive,
    getDaysRemaining,
    refreshSubscription: fetchUserSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
