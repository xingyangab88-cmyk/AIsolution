import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2, Link as LinkIcon } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="container footer-container">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <img src="/favicon.svg" alt="" className="brand-icon" />
            <span>solar<span className="text-gradient">khmer</span></span>
          </Link>
          <p className="footer-desc">
            solarkhmer helps users manage solar energy workflows with clear tools for clean energy planning and productivity.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Globe size={20} /></a>
            <a href="#" className="social-icon"><MessageCircle size={20} /></a>
            <a href="#" className="social-icon"><Share2 size={20} /></a>
            <a href="#" className="social-icon"><LinkIcon size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Services</h3>
          <ul className="footer-links">
            <li><Link to="/product">Residential Solar</Link></li>
            <li><Link to="/product">Commercial Solar</Link></li>
            <li><Link to="/product">Battery Storage</Link></li>
            <li><Link to="/product">Maintenance</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <MapPin size={18} className="contact-icon" />
              <span>123 Solar Blvd, Tech District, CA 90210</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="contact-icon" />
              <span>+1 (800) 123-4567</span>
            </div>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <span>hello@solarenergy.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} solarkhmer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
