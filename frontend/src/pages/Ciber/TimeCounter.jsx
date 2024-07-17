import React, { useState, useEffect } from 'react';

const TimeCounter = ({ computerId, time }) => {
  const [currentTime, setCurrentTime] = useState(time);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentTime === 0) {
      // Calcular costo al finalizar el tiempo
      const calculatedCost = calculateCost(time); // Función ficticia para calcular el costo
      setCost(calculatedCost);

      // Aquí podrías mostrar un componente o modal con el costo
    }
  }, [currentTime]);

  const calculateCost = (minutes) => {
    // Implementa tu lógica para calcular el costo
    // Por ejemplo, supongamos un costo base de $1 por cada 10 minutos
    const baseCost = Math.ceil(minutes / 10) * 1;
    return baseCost;
  };

  return (
    <div className="time-counter">
      <h3>Computadora {computerId}</h3>
      <p>Tiempo restante: {currentTime} minutos</p>
      {currentTime === 0 && (
        <p>Costo total: ${cost}</p>
      )}
    </div>
  );
};

export default TimeCounter;
