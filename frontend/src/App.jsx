
import React from 'react';
import NavbarComponent from './components/Navbar';
import LandingPage from './LandingPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarComponent />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
}

export default App;
