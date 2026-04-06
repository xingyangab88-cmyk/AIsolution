import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sun, Shield, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge">Next-Gen Solar Energy</div>
            <h1 className="hero-title">
              Power Your Future With <span className="text-gradient">Solar Innovation</span>
            </h1>
            <p className="hero-subtitle">
              Harness the power of the sun with premium, high-efficiency solar panels designed for modern homes and businesses. Maximize energy, minimize costs.
            </p>
            <div className="hero-cta">
              <Link to="/product" className="btn btn-primary">
                Explore Panels
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get a Free Quote
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="glow-effect"></div>
            {/* Using a placeholder gradient block for the sleek modern vibe since we need visuals. A real app will have user's image */}
            <div className="hero-graphic">
              <Sun size={120} className="graphic-icon" />
              <div className="graphic-stats">
                <div className="stat">
                  <span className="stat-val">99%</span>
                  <span className="stat-label">Clean Energy</span>
                </div>
                <div className="stat">
                  <span className="stat-val">24/7</span>
                  <span className="stat-label">Power Supply</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features pad-y">
        <div className="container">
          <h2 className="section-title">Why Choose <span className="text-gradient">Solar</span></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap className="feature-icon" size={32} />
              </div>
              <h3>Maximum Efficiency</h3>
              <p>Our monocrystalline panels offer industry-leading conversion rates, generating more power in less space.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield className="feature-icon" size={32} />
              </div>
              <h3>25-Year Warranty</h3>
              <p>Peace of mind with comprehensive coverage on parts, performance, and labor for two and a half decades.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sun className="feature-icon" size={32} />
              </div>
              <h3>Smart Monitoring</h3>
              <p>Track your energy production and consumption in real-time through our intuitive mobile application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section pad-y">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Ready to switch to clean energy?</h2>
            <p>Join thousands of homeowners saving money while saving the planet. Get your custom solar estimate today.</p>
          </div>
          <Link to="/contact" className="btn btn-primary cta-btn">
            Start Your Journey <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
