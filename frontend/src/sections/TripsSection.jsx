import React from 'react';
import { Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './TripsSection.css';

const trips = [
  { title: 'Mountain Escape', date: 'Aug 20', club: 'Trailblazers', img: '/src/assets/trip1.jpg', desc: 'Ride through scenic mountain trails.' },
  { title: 'City Lights', date: 'Sep 5', club: 'Urban Riders', img: '/src/assets/trip2.jpg', desc: 'Night ride across the city.' },
  { title: 'Speed Run', date: 'Sep 18', club: 'Speed Demons', img: '/src/assets/trip3.jpg', desc: 'High-speed adventure.' },
  { title: 'Forest Retreat', date: 'Oct 2', club: 'Nature Nomads', img: '/src/assets/trip4.jpg', desc: 'Eco-friendly forest ride.' },
];

export default function TripsSection() {
  return (
    <div className="trips-section">
      <h2 className="section-title">🌍 Upcoming Trips</h2>
      <Carousel className="trips-carousel" interval={5000}>
        {trips.map((trip, idx) => (
          <Carousel.Item key={trip.title}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
              <div className="trip-card glass-card">
                <img src={trip.img} alt={trip.title} className="trip-img" />
                <div className="trip-info">
                  <h3>{trip.title}</h3>
                  <p className="trip-date">{trip.date} • {trip.club}</p>
                  <p>{trip.desc}</p>
                </div>
              </div>
            </motion.div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
