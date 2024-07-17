import React, { useState, useEffect } from 'react';
import './TimeInputModal.css';

const TimeInputModal = ({ computerId, onClose, onConfirm }) => {
  const [selectedTime, setSelectedTime] = useState('Media hora'); // Estado para el tiempo seleccionado

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(selectedTime); // Llamar a la función onConfirm pasada como prop
    onClose(); // Cerrar el modal después de confirmar
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="time-input-modal">
      <div className="modal-content">
        <h2>Selecciona el tiempo de uso</h2>
        <select className="time-select" value={selectedTime} onChange={handleTimeChange}>
          <option value="Media hora">Media hora</option>
          <option value="1 hora">1 hora</option>
          <option value="2 horas">2 horas</option>
          <option value="3 horas">3 horas</option>
          <option value="4 horas">4 horas</option>
          <option value="5 horas">5 horas</option>
          <option value="6 horas">6 horas</option>
          <option value="7 horas">7 horas</option>
          <option value="8 horas">8 horas</option>
        </select>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleConfirm}>Confirmar</button>
          <button className="close-button" onClick={handleClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default TimeInputModal;
