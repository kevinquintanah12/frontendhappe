import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiciosBurbuja.css';

const ServiciosBurbuja = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/servicios/servicios');
        setServicios(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const handleClick = (enlace) => {
    window.open(enlace, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="servicios-burbuja-container">
      {loading ? (
        <p>Cargando servicios...</p>
      ) : (
        servicios.map(servicio => (
          <div
            key={servicio.id}
            className="servicio-burbuja"
            onClick={() => handleClick(servicio.descripcion)}
          >
            <div className="servicio-burbuja-content">
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              <p className="precio">Precio: ${servicio.precio}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiciosBurbuja;
