import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './VariosTable.css';
import './EditVarioModal.css';
import './SearchVario.css';
import ConfirmationDialog from './ConfirmationDialog';
import GuardarVarioButton from './GuardarVariosButton';

const VariosTable = ({ varios, onEdit, refreshVarios }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [varioIdToDelete, setVarioIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const response = await axios.get(`http://localhost:3001/varios/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching varios:', error);
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
    setVarioIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/varios/eliminarvarios/${varioIdToDelete}`);
      console.log(`Vario con ID ${varioIdToDelete} eliminado correctamente`);
      refreshVarios();
    } catch (error) {
      console.error('Error al eliminar el vario:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setVarioIdToDelete(null);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };

  const variosToShow = searchQuery.trim() !== '' ? searchResults : varios;

  return (
    <div className="varios-list-container">
      <div className="varios-controls">
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
        <GuardarVarioButton refreshVarios={refreshVarios} />
      </div>
      <div className="varios-table-container">
        <table className="varios-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Venta</th>
              <th>Precio Compra</th>
              <th>Ganancia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {variosToShow.length > 0 ? (
              variosToShow.map((vario) => (
                <tr key={vario.id}>
                  <td>{vario.codigo}</td>
                  <td>{vario.nombre}</td>
                  <td>{vario.descripcion}</td>
                  <td>{vario.precio}</td>
                  <td>{vario.precioCompra}</td>
                  <td>{vario.ganancia}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => onEdit(vario)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="delete-icon"
                      onClick={() => handleDelete(vario.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No se encontraron varios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirmDialog && (
        <ConfirmationDialog
          message="¿Estás seguro de eliminar este vario?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

const EditVarioModal = ({ vario, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...vario });
  const codigoRef = useRef(null);

  useEffect(() => {
    if (codigoRef.current) {
      codigoRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      if (name === 'precio' || name === 'precioCompra') {
        const precio = name === 'precio' ? parseFloat(value) : parseFloat(prevFormData.precio);
        const precioCompra = name === 'precioCompra' ? parseFloat(value) : parseFloat(prevFormData.precioCompra);
        const ganancia = precio - precioCompra;
        updatedFormData.ganancia = ganancia;
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/varios/editarservicio', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      onSave(formData);
    } catch (error) {
      console.error('Error updating vario:', error);
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
            readOnly
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
            name="ganancia"
            value={formData.ganancia}
            readOnly
            placeholder="Ganancia"
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

const VariosList = () => {
  const [varios, setVarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVario, setEditingVario] = useState(null);

  useEffect(() => {
    fetchVarios();
  }, []);

  const fetchVarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/varios/varios');
      setVarios(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching varios:', error);
    }
  };

  const handleEditVario = (vario) => {
    setEditingVario(vario);
  };

  const handleSaveVario = (updatedVario) => {
    setVarios((prevVarios) =>
      prevVarios.map((vario) =>
        vario.id === updatedVario.id ? updatedVario : vario
      )
    );
    setEditingVario(null);
  };

  const handleCancelEdit = () => {
    setEditingVario(null);
  };

  return (
    <div>
      {loading ? (
        <p>Cargando varios...</p>
      ) : (
        <VariosTable
          varios={varios}
          onEdit={handleEditVario}
          refreshVarios={fetchVarios}
        />
      )}
      {editingVario && (
        <EditVarioModal
          vario={editingVario}
          onSave={handleSaveVario}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default VariosList;