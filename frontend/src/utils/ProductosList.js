import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductosTable from '../pages/InventarioPages/ProductosTable'; // El componente de tabla que definiste antes

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productos/productos'); // Ruta al endpoint del backend
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="productos-list-container">
      <h2>Listado de Productos</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : productos && productos.length > 0 ? (
        <ProductosTable productos={productos} />
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </div>
  );
};

export default ProductosList;
