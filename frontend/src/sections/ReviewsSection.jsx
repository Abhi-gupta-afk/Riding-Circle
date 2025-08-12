import React from 'react';
import { Carousel } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import './ReviewsSection.css';

const reviews = [
  { name: 'Amit', avatar: '/src/assets/user1.jpg', rating: 5, text: 'Best club experience! Safe and fun rides.' },
  { name: 'Priya', avatar: '/src/assets/user2.jpg', rating: 4, text: 'Loved the community and events.' },
  { name: 'Rahul', avatar: '/src/assets/user3.jpg', rating: 5, text: 'Trips are well organized and exciting.' },
  { name: 'Sara', avatar: '/src/assets/user4.jpg', rating: 5, text: 'Premium plan is totally worth it.' },
];

export default function ReviewsSection() {
  return (
    <div className="reviews-section">
      <h2 className="section-title">⭐ Community Reviews</h2>
      <Carousel className="reviews-carousel" interval={6000}>
        {reviews.map((r, idx) => (
          <Carousel.Item key={r.name}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
              <div className="review-card glass-card">
                <img src={r.avatar} alt={r.name} className="review-avatar" />
                <div className="review-info">
                  <h4>{r.name}</h4>
                  <div className="review-rating">
                    {[...Array(r.rating)].map((_, i) => <StarFill key={i} color="#ff9800" />)}
                  </div>
                  <p>{r.text}</p>
                </div>
              </div>
            </motion.div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
