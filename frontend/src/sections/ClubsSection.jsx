import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './ClubsSection.css';

const clubs = [
  { name: 'Trailblazers', logo: '/src/assets/club1.png', desc: 'Adventure seekers and trail lovers.' },
  { name: 'Urban Riders', logo: '/src/assets/club2.png', desc: 'City rides and social meetups.' },
  { name: 'Speed Demons', logo: '/src/assets/club3.png', desc: 'Fast rides, adrenaline rush.' },
  { name: 'Nature Nomads', logo: '/src/assets/club4.png', desc: 'Eco-friendly, scenic routes.' },
];

export default function ClubsSection() {
  return (
    <div className="clubs-section">
      <h2 className="section-title">🏍️ Bike Clubs</h2>
      <Row xs={1} md={2} lg={4} className="g-4 clubs-grid">
        {clubs.map((club, idx) => (
          <Col key={club.name}>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
              <Card className="club-card glass-card">
                <Card.Img variant="top" src={club.logo} alt={club.name} className="club-logo" />
                <Card.Body>
                  <Card.Title>{club.name}</Card.Title>
                  <Card.Text>{club.desc}</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
