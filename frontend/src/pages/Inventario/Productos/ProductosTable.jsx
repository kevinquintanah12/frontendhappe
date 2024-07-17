import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ProductosTable.css';
import './EditProductModal.css';
import './SearchProducto.css';
import ConfirmationDialog from './ConfirmationDialog';
import GuardarProductoButton from './GuardarProductoButton';

const ProductosTable = ({ productos, onEdit, refreshProductos }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const response = await axios.get(`http://localhost:3001/productos/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching products:', error);
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
    setProductIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/productos/eliminarproducto/${productIdToDelete}`);
      console.log(`Producto con ID ${productIdToDelete} eliminado correctamente`);
      refreshProductos();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setProductIdToDelete(null);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };

  const productosToShow = searchQuery.trim() !== '' ? searchResults : productos;

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
        <GuardarProductoButton refreshProductos={refreshProductos} />
      </div>
      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio Venta</th>
              <th>Precio Compra</th>
              <th>Stock</th>
              <th>Presentación</th>
              <th>Ganancia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosToShow.length > 0 ? (
              productosToShow.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.precioVenta}</td>
                  <td>{producto.precioCompra}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.presentacion}</td>
                  <td>{producto.ganancia}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => onEdit(producto)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="delete-icon"
                      onClick={() => handleDelete(producto.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirmDialog && (
        <ConfirmationDialog
          message="¿Estás seguro de eliminar este producto?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

const EditProductModal = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...producto });
  const [categorias, setCategorias] = useState([]);
  const codigoRef = useRef(null);

  useEffect(() => {
    if (codigoRef.current) {
      codigoRef.current.focus();
    }

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
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      if (name === 'precioVenta' || name === 'precioCompra') {
        const precioVenta = name === 'precioVenta' ? parseFloat(value) : parseFloat(prevFormData.precioVenta);
        const precioCompra = name === 'precioCompra' ? parseFloat(value) : parseFloat(prevFormData.precioCompra);
        const ganancia = precioVenta - precioCompra;
        updatedFormData.ganancia = ganancia;
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/productos/editarproducto', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      onSave(formData);
    } catch (error) {
      console.error('Error updating product:', error);
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
            value={formData.ganancia} // Calcula la ganancia automáticamente
            readOnly // Hace que el campo sea de solo lectura
            placeholder="Ganancia"
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productos/productos');
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const refreshProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/productos/productos');
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
  };

  const handleSave = (updatedProduct) => {
    setEditingProduct(null);
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === updatedProduct.id ? updatedProduct : producto
      )
    );
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div className="productos-list-container">
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          <ProductosTable productos={productos} onEdit={handleEdit} refreshProductos={refreshProductos} />
          {editingProduct && (
            <EditProductModal
              producto={editingProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductosList;
