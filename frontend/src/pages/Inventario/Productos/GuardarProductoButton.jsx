import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuardarProductoButton.css';

const GuardarProductoButton = ({ refreshProductos }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precioVenta: '',
    precioCompra: '',
    stock: '',
    presentacion: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categoria/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { codigo, nombre, descripcion, categoria, precioVenta, precioCompra, stock, presentacion } = formData;

    // Validar si todos los campos están completos
    if (!codigo || !nombre || !descripcion || !categoria || !precioVenta || !precioCompra || !stock || !presentacion) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const ganancia = precioVenta - precioCompra;
    const newData = { ...formData, ganancia };

    try {
      await axios.post('http://localhost:3001/productos/agregarproducto', newData);
      console.log('Producto agregado correctamente');
      refreshProductos(); // Actualizar la lista de productos después de agregar uno nuevo
      setShowModal(false); // Cerrar el modal después de guardar
      setFormData({  // Limpiar el formulario después de guardar
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        precioVenta: '',
        precioCompra: '',
        stock: '',
        presentacion: ''
      });
      setError(''); // Limpiar el mensaje de error después de guardar correctamente
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error); // Mostrar mensaje de error específico
      } else {
        console.error('Error al agregar producto:', error);
        setError('Error al agregar producto'); // Mensaje de error genérico
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
      categoria: '',
      precioVenta: '',
      precioCompra: '',
      stock: '',
      presentacion: ''
    });
    setError(''); // Limpiar el mensaje de error al cerrar el modal
  };

  return (
    <>
      <button className="guardar-producto-button" onClick={openModal}>
        Agregar Producto
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
              <div className="select-wrapper">
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="categoria-select"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleChange}
                placeholder="Precio Venta"
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
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
              />
              <input
                type="text"
                name="presentacion"
                value={formData.presentacion}
                onChange={handleChange}
                placeholder="Presentación"
              />
              <input
                type="number"
                name="ganancia"
                value={formData.precioVenta - formData.precioCompra} // Calcula la ganancia automáticamente
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

export default GuardarProductoButton;
