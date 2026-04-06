import React from 'react';
import { Settings, Battery, Home as HomeIcon, Building2 } from 'lucide-react';
import './Product.css';

const Product = () => {
  const products = [
    {
      id: 1,
      name: "Nova Residential PanelX",
      category: "Residential",
      efficiency: "22.5%",
      power: "400W",
      icon: <HomeIcon size={40} className="product-icon" />,
      desc: "Our flagship monocrystalline panel designed specifically for residential rooftops. High efficiency even in low-light conditions."
    },
    {
      id: 2,
      name: "Nova Commercial ProMax",
      category: "Commercial",
      efficiency: "23.1%",
      power: "550W",
      icon: <Building2 size={40} className="product-icon" />,
      desc: "Industrial-grade panels built to scale. Perfect for large commercial buildings and solar farms looking to maximize ROI."
    },
    {
      id: 3,
      name: "Nova Storage PowerWall",
      category: "Storage",
      efficiency: "95%",
      power: "13.5kWh",
      icon: <Battery size={40} className="product-icon" />,
      desc: "Store excess solar energy for nighttime and backup use. Keep your home running during outages seamlessly."
    },
    {
      id: 4,
      name: "Nova Smart Inverter",
      category: "Accessories",
      efficiency: "99%",
      power: "Up to 10kW",
      icon: <Settings size={40} className="product-icon" />,
      desc: "The brain of your solar system. Converts DC power to AC power with ultimate intelligence and monitoring capabilities."
    }
  ];

  return (
    <div className="product-page animate-fade-in pad-y">
      <div className="container">
        <div className="page-header">
          <div className="badge">Our Solutions</div>
          <h1 className="section-title">Premium Solar <span className="text-gradient">Products</span></h1>
          <p className="page-subtitle">
            Explore our range of high-efficiency solar panels, intelligent inverters, and powerful storage solutions. Build a system that meets your specific energy needs.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-header">
                {product.icon}
                <span className="product-category">{product.category}</span>
              </div>
              <h3>{product.name}</h3>
              <p className="product-desc">{product.desc}</p>
              
              <div className="product-specs">
                <div className="spec">
                  <span className="spec-label">Efficiency</span>
                  <span className="spec-value">{product.efficiency}</span>
                </div>
                <div className="spec">
                  <span className="spec-label">Output</span>
                  <span className="spec-value">{product.power}</span>
                </div>
              </div>

              <button className="btn btn-outline" style={{width: '100%', marginTop: '1.5rem'}}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
