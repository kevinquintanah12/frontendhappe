import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/TablaVenta';
import Header from './components/Header';
import Inventario from './pages/Inventario';
import Productos from './pages/Inventario/Productos/ProductosTable';
import Varios from './pages/Inventario/Varios/VariosTable';
import Servicios from './pages/Inventario/Servicios/ServiciosTable';
import Ciber from './pages/Ciber/CyberControl';
import ServiciosBurbuja from './pages/Servicios/ServiciosBurbuja';
import BarraLateral from './components/BarraLateral';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="App">
          <BarraLateral />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/dashboard/page1" element={<Productos />} />
              <Route path="/dashboard/page2" element={<Servicios />} />
              <Route path="/dashboard/page3" element={<Varios />} />
              <Route path="/dashboard/page3" element={<Varios />} />
              <Route path="/servicios" element={<ServiciosBurbuja />} />
              <Route path="/ciber" element={<Ciber />} />





            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
