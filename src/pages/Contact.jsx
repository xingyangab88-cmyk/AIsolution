import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page animate-fade-in pad-y">
      <div className="container">

        <div className="page-header">
          <div className="badge">Get In Touch</div>
          <h1 className="section-title">Contact <span className="text-gradient">SolarEnergy</span></h1>
          <p className="page-subtitle">
            Ready to transition to solar or have questions about our products? Our energy experts are here to help you every step of the way.
          </p>
        </div>

        <div className="contact-wrapper">

          <div className="contact-info-panel">
            <h3>Contact Information</h3>
            <p>Fill out the form and our team will get back to you within 24 hours.</p>

            <div className="contact-details">
              <div className="contact-detail-item">
                <Phone className="detail-icon" size={24} />
                <div>
                  <h4>Phone</h4>
                  <p>+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <Mail className="detail-icon" size={24} />
                <div>
                  <h4>Email</h4>
                  <p>hello@solarenergy.com</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <MapPin className="detail-icon" size={24} />
                <div>
                  <h4>Headquarters</h4>
                  <p>123 Solar Blvd, Tech District<br />California, CA 90210</p>
                </div>
              </div>
            </div>

            <div className="contact-glow"></div>
          </div>

          <div className="contact-form-panel">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="John" />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" placeholder="(555) 000-0000" />
                </div>
              </div>

              <div className="form-group">
                <label>Interested In</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="interest" defaultChecked /> Residential
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="interest" /> Commercial
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="interest" /> Maintenance
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="4" placeholder="Tell us about your energy needs..."></textarea>
              </div>

              <button className="btn btn-primary submit-btn">
                Send Message <Send size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
