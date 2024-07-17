import React from 'react';
import { useNavigate } from 'react-router-dom';
import productosImg from '../images/productos.png';
import serviciosImg from '../images/servicios.png';
import variosImg from '../images/varios.png';
import diseñoImg from '../images/diseño.png';

import './Inventario.css';

const Inventario = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="inventario-container">
      <div className="cards-container">
        <div className="card" onClick={() => handleNavigation('page1')}>
          <img src={productosImg} alt="" className="card-image" />
          <div className="card-text">productos</div>
        </div>
        <div className="card" onClick={() => handleNavigation('page2')}>
          <img src={serviciosImg} alt="" className="card-image" />
          <div className="card-text">servicios</div>
        </div>
        <div className="card" onClick={() => handleNavigation('page3')}>
          <img src={variosImg} alt="" className="card-image" />
          <div className="card-text">varios</div>
        </div>
        <div className="card" onClick={() => handleNavigation('page4')}>
          <img src={diseñoImg} alt="" className="card-image" />
          <div className="card-text">diseño</div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
