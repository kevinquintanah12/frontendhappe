import React, { useState } from 'react';
import TimeInputModal from './TimeInputModal'; // Componente para ingresar el tiempo de uso
import './CyberControl.css';

const CyberControl = () => {
  const [computers, setComputers] = useState([
    { id: 1, name: 'PC-01', status: 'Libre', timeRemaining: 0 },
    { id: 2, name: 'PC-02', status: 'Libre', timeRemaining: 0 },
    // Puedes agregar más computadoras según sea necesario
  ]);

  const [selectedComputer, setSelectedComputer] = useState(null); // Estado para la computadora seleccionada

  const handleStart = (computerId) => {
    setSelectedComputer(computerId);
  };

  const handleConfirmTime = (selectedTime) => {
    const timesInSeconds = {
      'Media hora': 30 * 60,
      '1 hora': 60 * 60,
      '2 horas': 2 * 60 * 60,
      '3 horas': 3 * 60 * 60,
      '4 horas': 4 * 60 * 60,
      '5 horas': 5 * 60 * 60,
      '6 horas': 6 * 60 * 60,
      '7 horas': 7 * 60 * 60,
      '8 horas': 8 * 60 * 60,
    };

    const updatedComputers = computers.map(computer => {
      if (computer.id === selectedComputer) {
        return { ...computer, status: 'Ocupado', timeRemaining: timesInSeconds[selectedTime] };
      }
      return computer;
    });
    setComputers(updatedComputers);
    setSelectedComputer(null);
  };

  const handleCloseModal = () => {
    setSelectedComputer(null); // Limpiar la computadora seleccionada al cerrar el modal
  };

  return (
    <div className="cyber-control-container">
      <table className="computadoras-table">
        <thead>
          <tr>
            <th>Computadora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {computers.map(computer => (
            <tr key={computer.id}>
              <td>{computer.name}</td>
              <td>{computer.status}</td>
              <td>
                {computer.status === 'Libre' ? (
                  <button className="iniciar-button" onClick={() => handleStart(computer.id)}>Iniciar</button>
                ) : (
                  <span>{computer.timeRemaining > 0 ? `Tiempo restante: ${Math.floor(computer.timeRemaining / 60)}:${computer.timeRemaining % 60 < 10 ? '0' : ''}${computer.timeRemaining % 60}` : 'Tiempo agotado'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedComputer !== null && (
        <TimeInputModal computerId={selectedComputer} onClose={handleCloseModal} onConfirm={handleConfirmTime} />
      )}
    </div>
  );
};

export default CyberControl;
