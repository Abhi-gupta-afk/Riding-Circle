import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Facebook, Instagram, Twitter } from 'react-bootstrap-icons';
import './FooterSection.css';

export default function FooterSection() {
  return (
    <footer className="footer-section">
      <Container>
        <Row className="mb-3">
          <Col md={6} className="newsletter">
            <h5>Subscribe to our Newsletter</h5>
            <Form className="d-flex">
              <Form.Control type="email" placeholder="Enter email" className="me-2" />
              <Button variant="danger">Subscribe</Button>
            </Form>
          </Col>
          <Col md={6} className="contact-info">
            <h5>Contact Us</h5>
            <p>Email: info@ridecircle.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="social-icons">
              <a href="#"><Facebook size={28} color="#fff" className="me-2" /></a>
              <a href="#"><Instagram size={28} color="#fff" className="me-2" /></a>
              <a href="#"><Twitter size={28} color="#fff" /></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <small>© 2025 RideCircle. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
