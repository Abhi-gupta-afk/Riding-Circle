import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import AddClub from './pages/AddClub';
import EditClub from './pages/EditClub';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import AddTrip from './pages/AddTrip';
import EditTrip from './pages/EditTrip';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import FoodPreferences from './pages/FoodPreferences';
import Restaurants from './pages/Restaurants';
import SubscriptionPlans from './pages/SubscriptionPlans';
import TestSubscriptionAPI from './pages/TestSubscriptionAPI';
import AdminFoodManagement from './pages/AdminFoodManagement';
import AppNavbar from './components/Navbar';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function AppRouter() {
  return (
    <SubscriptionProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <AppNavbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/add" element={<AddClub />} />
              <Route path="/clubs/:id" element={<ClubDetail />} />
              <Route path="/clubs/:id/edit" element={<EditClub />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/trips/add" element={<AddTrip />} />
              <Route path="/clubs/:clubId/trips/add" element={<AddTrip />} />
              <Route path="/trips/:id" element={<TripDetail />} />
              <Route path="/trips/:id/edit" element={<EditTrip />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/food-preferences" element={<FoodPreferences />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/test-api" element={<TestSubscriptionAPI />} />
              <Route path="/admin/foods" element={<AdminFoodManagement />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SubscriptionProvider>
  );
}
