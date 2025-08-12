import React from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './LandingHero.css';

export default function LandingHero({ onScroll }) {
  return (
    <div className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src="/src/assets/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay">
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="hero-logo">RideCircle</h1>
          <h2 className="hero-tagline">Unite. Ride. Explore.</h2>
          <div className="hero-cta">
            <Button variant="danger" size="lg" className="me-3 ripple-btn" onClick={() => onScroll('clubs')}>Explore Clubs</Button>
            <Button variant="outline-light" size="lg" className="ripple-btn" onClick={() => onScroll('login')}>Login</Button>
          </div>
        </motion.div>
        <div className="scroll-indicator" onClick={() => onScroll('clubs')}>
          <span className="scroll-dot"></span>
        </div>
      </div>
    </div>
  );
}
