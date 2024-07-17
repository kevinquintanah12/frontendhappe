import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './TablaVenta.css';

const TablaVenta = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [ventaItems, setVentaItems] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Inicializar en -1 para indicar ningún ítem resaltado
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const productResponse = await axios.get(`http://localhost:3001/productos/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          const serviceResponse = await axios.get(`http://localhost:3001/servicios/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          const variousResponse = await axios.get(`http://localhost:3001/varios/buscar?query=${encodeURIComponent(searchQuery.toLowerCase())}`);
          const results = [...productResponse.data, ...serviceResponse.data, ...variousResponse.data];
          setSearchResults(results);

          // Check if search query matches an item code exactly
          const exactMatch = results.find(item => item.codigo === searchQuery);
          if (exactMatch) {
            addVentaItem(exactMatch);
            setSearchQuery(''); // Clear the search query
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error searching items:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1); // Reiniciar el índice resaltado al cambiar la búsqueda
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevenir el comportamiento predeterminado del scroll al usar las flechas
      setHighlightedIndex(prevIndex => (prevIndex + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevenir el comportamiento predeterminado del scroll al usar las flechas
      setHighlightedIndex(prevIndex => (prevIndex - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      if (highlightedIndex !== -1) {
        addVentaItem(searchResults[highlightedIndex]);
      }
    }
  };

  const addVentaItem = (item) => {
    setVentaItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.codigo === item.codigo);
      if (existingItem) {
        return prevItems.map((i) =>
          i.codigo === item.codigo ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });
    setSearchQuery(''); // Limpiar la búsqueda después de agregar el ítem
    setSearchResults([]); // Limpiar los resultados de búsqueda
    setHighlightedIndex(-1); // Reiniciar el índice resaltado después de agregar el ítem
  };

  const removeVentaItem = (codigo) => {
    setVentaItems((prevItems) => prevItems.filter((item) => item.codigo !== codigo));
  };

  const updateVentaItemCantidad = (codigo, cantidad) => {
    setVentaItems((prevItems) =>
      prevItems.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: cantidad } : item
      )
    );
  };

  const calculateTotal = () => {
    return ventaItems.reduce((total, item) => total + (item.precio || item.precioVenta) * item.cantidad, 0).toFixed(2);
  };

  return (
    <div className="tabla-venta-container">
      <div className="search-container">
        <input
          type="search"
          placeholder="Buscar por Código o Nombre"
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
        />
        <div className="search-results">
          {searchResults.map((item, index) => (
            <div
              key={item.codigo}
              className={`search-result-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => addVentaItem(item)}
            >
              {item.nombre} ({item.codigo})
            </div>
          ))}
        </div>
      </div>
      <table className="tabla-venta">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventaItems.map((item) => (
            <tr key={item.codigo}>
              <td>{item.codigo}</td>
              <td>{item.nombre}</td>
              <td>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => updateVentaItemCantidad(item.codigo, parseInt(e.target.value))}
                />
              </td>
              <td>{item.precio || item.precioVenta}</td>
              <td>{((item.precio || item.precioVenta) * item.cantidad).toFixed(2)}</td>
              <td>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="delete-icon"
                  onClick={() => removeVentaItem(item.codigo)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-container">
        <h2>Total: ${calculateTotal()}</h2>
      </div>
    </div>
  );
};

export default TablaVenta;
