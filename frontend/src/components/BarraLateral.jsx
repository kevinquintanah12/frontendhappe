import React from "react";
import { Link } from "react-router-dom";
import "./BarraLateral.css"; // Importa el archivo CSS con los estilos
import cobrar from "../images/cobrar.png";
import inventario from "../images/inventario.png";
import serviciosicono from "../images/serviciosicono.png";
import ciber from "../images/ciber.png";


const BarraLateral = () => {
  return (
    <>
      <div className="menu-links">
        <Link to="/">
          <img src={cobrar} alt="Home" className="menu-icon" />
          Cobrar
        </Link>
        <Link to="/servicios">
          <img src={serviciosicono} alt="Servicios" className="menu-icon" />
          Servicios
        </Link>
        <Link to="/ciber">
          <img src={ciber} alt="Ciber" className="menu-icon" />
          Ciber
        </Link>
        <Link to="/inventario">
          <img src={inventario} alt="Inventario" className="menu-icon" />
          Inventario
        </Link>
      </div>
    </>
  );
};

export default BarraLateral;
