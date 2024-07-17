import React, { useState, useEffect } from 'react';
import './Header.css'; // Importa el archivo CSS con los estilos
import logo from '../images/logo.png'; // Ajusta la ruta según tu estructura de archivos

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCerrarCaja = () => {
    alert('Caja cerrada');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="time-container">
        <span className="date">{formatDate(currentTime)}</span>
        <span className="time">{formatTime(currentTime)}</span>
      </div>
      <button className="close-box-btn" onClick={handleCerrarCaja}>Cerrar Caja</button>
    </header>
  );
};

export default Header;
