import React from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './JoinSection.css';

export default function JoinSection() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <div className="join-section">
      <h2 className="section-title">Join Us</h2>
      <Row xs={1} md={2} className="g-4 join-grid">
        <Col>
          <motion.div whileHover={{ scale: 1.05 }} className="join-card glass-card">
            <h4>Join as a Rider</h4>
            <p>Discover trips, join clubs, and connect with fellow bikers.</p>
            <Button variant="danger" size="lg" href="/register">Sign Up</Button>
          </motion.div>
        </Col>
        <Col>
          <motion.div whileHover={{ scale: 1.05 }} className="join-card glass-card">
            <h4>Manage as Admin</h4>
            <p>Organize clubs, manage trips, and view reports.</p>
            <Button variant="outline-light" size="lg" href="/admin">Admin Dashboard</Button>
          </motion.div>
        </Col>
      </Row>
      {(token && role === 'admin') && (
        <div className="admin-shortcuts">
          <h5>Admin Shortcuts</h5>
          <Row xs={1} md={3} className="g-3">
            <Col><Card className="shortcut-card glass-card"><Card.Body>Manage Clubs</Card.Body></Card></Col>
            <Col><Card className="shortcut-card glass-card"><Card.Body>Trips Dashboard</Card.Body></Card></Col>
            <Col><Card className="shortcut-card glass-card"><Card.Body>Reports</Card.Body></Card></Col>
          </Row>
        </div>
      )}
      {(token && role === 'user') && (
        <div className="user-shortcuts">
          <h5>User Shortcuts</h5>
          <Row xs={1} md={3} className="g-3">
            <Col><Card className="shortcut-card glass-card"><Card.Body>Explore Trips</Card.Body></Card></Col>
            <Col><Card className="shortcut-card glass-card"><Card.Body>Join a Club</Card.Body></Card></Col>
            <Col><Card className="shortcut-card glass-card"><Card.Body>My Profile</Card.Body></Card></Col>
          </Row>
        </div>
      )}
    </div>
  );
}
