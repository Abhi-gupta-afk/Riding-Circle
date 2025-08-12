import React, { useRef } from 'react';
import LandingHero from './sections/LandingHero';
import ParallaxSection from './components/ParallaxSection';
import ClubsSection from './sections/ClubsSection';
import TripsSection from './sections/TripsSection';
import WhySection from './sections/WhySection';
import ReviewsSection from './sections/ReviewsSection';
import JoinSection from './sections/JoinSection';
import FooterSection from './sections/FooterSection';
import './LandingPage.css';

export default function LandingPage() {
  const clubsRef = useRef();
  const tripsRef = useRef();
  const whyRef = useRef();
  const reviewsRef = useRef();
  const joinRef = useRef();

  const handleScroll = (section) => {
    const refs = {
      clubs: clubsRef,
      trips: tripsRef,
      why: whyRef,
      reviews: reviewsRef,
      join: joinRef,
    };
    if (refs[section]?.current) {
      refs[section].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root">
      <LandingHero onScroll={handleScroll} />
      <div ref={clubsRef}><ParallaxSection><ClubsSection /></ParallaxSection></div>
      <div ref={tripsRef}><ParallaxSection><TripsSection /></ParallaxSection></div>
      <div ref={whyRef}><ParallaxSection><WhySection /></ParallaxSection></div>
      <div ref={reviewsRef}><ParallaxSection><ReviewsSection /></ParallaxSection></div>
      <div ref={joinRef}><ParallaxSection><JoinSection /></ParallaxSection></div>
      <FooterSection />
    </div>
  );
}
