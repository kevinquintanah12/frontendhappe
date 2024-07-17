import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ServiciosTable.css';
import './EditServicioModal.css';
import './SearchServicio.css';
import ConfirmationDialog from './ConfirmationDialog';
import GuardarServicioButton from './GuardarServicioButton';

const ServiciosTable = ({ servicios, onEdit, refreshServicios }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const response = await axios.get(`http://localhost:3001/servicios/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching services:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleDelete = (id) => {
    setShowConfirmDialog(true);
    setServiceIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/servicios/eliminarservicio/${serviceIdToDelete}`);
      console.log(`Servicio con ID ${serviceIdToDelete} eliminado correctamente`);
      refreshServicios();
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setServiceIdToDelete(null);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };

  const serviciosToShow = searchQuery.trim() !== '' ? searchResults : servicios;

  return (
    <div className="productos-list-container">
      <div className="productos-controls">
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Buscar por Código o Nombre"
            type="search"
            className="input"
            value={searchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
        </div>
        <GuardarServicioButton refreshServicios={refreshServicios} />
      </div>
      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Precio Compra</th>
              <th>Ganancia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosToShow.length > 0 ? (
              serviciosToShow.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.codigo}</td>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.descripcion}</td>
                  <td>{servicio.precio}</td>
                  <td>{servicio.precioCompra}</td>
                  <td>{servicio.ganancia}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => onEdit(servicio)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="delete-icon"
                      onClick={() => handleDelete(servicio.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No se encontraron servicios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirmDialog && (
        <ConfirmationDialog
          message="¿Estás seguro de eliminar este servicio?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

const EditServiceModal = ({ servicio, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...servicio });
  const codigoRef = useRef(null);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/servicios/editarservicio', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      onSave(formData);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData.id} />
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Código"
            ref={codigoRef}
            readOnly // Asumo que el código no se puede editar
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
            value={formData.ganancia}
            onChange={handleChange}
            placeholder="Ganancia"
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};
const ServiciosList = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);

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

  const refreshServicios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/servicios/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error refreshing services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleEditClose = () => {
    setEditingService(null);
  };

  return (
    <div className="productos-list">
      {loading ? (
        <p>Cargando servicios...</p>
      ) : (
        <>
          <ServiciosTable servicios={servicios} onEdit={handleEdit} refreshServicios={refreshServicios} />
          {editingService && (
            <EditServiceModal servicio={editingService} onSave={handleEditClose} onCancel={handleEditClose} />
          )}
        </>
      )}
    </div>
  );
};

export default ServiciosList;
