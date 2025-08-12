import React from 'react';
import { motion } from 'framer-motion';
import './ParallaxSection.css';

export default function ParallaxSection({ children }) {
  return (
    <motion.section
      className="parallax-section"
      initial={{ opacity: 0, scale: 0.98, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
