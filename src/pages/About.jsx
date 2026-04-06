import React from 'react';
import { Target, Leaf, Award, Users } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page animate-fade-in pad-y">
      <div className="container">

        <div className="about-hero">
          <div className="about-hero-text">
            <div className="badge">Our Story</div>
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              Pioneering a <span className="text-gradient">Brighter</span> Future
            </h1>
            <p className="about-lead">
              Founded in 2026, Solar began with a simple mission: to make clean, renewable energy accessible and aesthetically pleasing for everyone. We believe that transitioning to solar shouldn't just be an environmental choice, but a lifestyle upgrade.
            </p>
            <p className="about-desc">
              Our team of expert engineers and designers work tirelessly to bring state-of-the-art solar technology to homes and businesses across the globe, ensuring maximum efficiency without compromising on modern design principles.
            </p>
          </div>
          <div className="about-hero-image">
            <div className="image-placeholder">
              <Leaf size={80} className="placeholder-icon" />
            </div>
            <div className="experience-badge">
              <span className="exp-years">10+</span>
              <span className="exp-text">Years of Excellence</span>
            </div>
          </div>
        </div>

        <div className="values-section pad-y">
          <h2 className="section-title">Core <span className="text-gradient">Values</span></h2>
          <div className="values-grid">
            <div className="value-card">
              <Target className="value-icon" size={36} />
              <h3>Innovation</h3>
              <p>We continuously push the boundaries of photovoltaic technology to offer the most efficient panels on the market.</p>
            </div>
            <div className="value-card">
              <Leaf className="value-icon" size={36} />
              <h3>Sustainability</h3>
              <p>Every product we create is designed with a closed-loop life cycle in mind, minimizing environmental impact.</p>
            </div>
            <div className="value-card">
              <Award className="value-icon" size={36} />
              <h3>Quality</h3>
              <p>Premium materials and rigorous testing ensure our solar solutions withstand the harshest elements for decades.</p>
            </div>
            <div className="value-card">
              <Users className="value-icon" size={36} />
              <h3>Customer First</h3>
              <p>From custom quotes to final installation and maintenance, we provide white-glove service every step of the way.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
