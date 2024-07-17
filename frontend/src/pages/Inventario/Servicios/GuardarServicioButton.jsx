import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuardarServicioButton.css';

const GuardarServicioButton = ({ refreshServicios}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    precioCompra: '',
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { codigo, nombre, descripcion, precio, precioCompra } = formData;

    // Validar si todos los campos están completos
    if (!codigo || !nombre || !descripcion || !precio || !precioCompra) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const ganancia = precio - precioCompra;
    const newData = { ...formData, ganancia };

    try {
      await axios.post('http://localhost:3001/servicios/agregarservicio', newData);
      console.log('Servicio agregado correctamente');
      refreshServicios(); // Actualizar la lista de productos después de agregar uno nuevo
      setShowModal(false); // Cerrar el modal después de guardar
      setFormData({  // Limpiar el formulario después de guardar
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        precioCompra: '',
      });
      setError(''); // Limpiar el mensaje de error después de guardar correctamente
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error); // Mostrar mensaje de error específico
      } else {
        console.error('Error al agregar servicio:', error);
        setError('Error al agregar servicio'); // Mensaje de error genérico
      }
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({  // Limpiar el formulario al cerrar el modal
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      precioCompra: '',
    });
    setError(''); // Limpiar el mensaje de error al cerrar el modal
  };

  return (
    <>
      <button className="guardar-producto-button" onClick={openModal}>
        Agregar Servicio
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Código"
                autoFocus // Pone el foco automáticamente en este campo al abrir el modal
              />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
              />
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
              />
        
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Precio"
              />
              <input
                type="number"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleChange}
                placeholder="Precio Compra"
              />
              <input
                type="number"
                name="ganancia"
                value={formData.precio - formData.precioCompra} // Calcula la ganancia automáticamente
                readOnly // Hace que el campo sea de solo lectura
                placeholder="Ganancia"
              />
              
              <button type="submit">Guardar</button>
              <button type="button" onClick={closeModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GuardarServicioButton;
