import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ShieldLock, PeopleFill, StarFill, Gem } from 'react-bootstrap-icons';
import './WhySection.css';

const benefits = [
  { icon: <ShieldLock size={48} color="#ff5722" />, title: 'Safety', desc: 'Verified clubs, secure rides.' },
  { icon: <PeopleFill size={48} color="#ff9800" />, title: 'Community', desc: 'Meet fellow riders, join events.' },
  { icon: <StarFill size={48} color="#ff5722" />, title: 'Fun', desc: 'Exciting trips, new experiences.' },
  { icon: <Gem size={48} color="#ff9800" />, title: 'Premium', desc: 'Exclusive plans & perks.' },
];

export default function WhySection() {
  return (
    <div className="why-section">
      <h2 className="section-title">Why RideCircle?</h2>
      <Row xs={1} md={2} lg={4} className="g-4 why-grid">
        {benefits.map((b, idx) => (
          <Col key={b.title}>
            <motion.div whileHover={{ scale: 1.1 }} className="why-card glass-card">
              <div className="why-icon">{b.icon}</div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
