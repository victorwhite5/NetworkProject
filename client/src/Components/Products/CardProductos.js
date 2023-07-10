import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import MakeBid from "../Bids/MakeBid";
import "./EstiloCard.css";
import Timer from "../Bids/Timer";

const CardProductos = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [tiempoTerminado, setTiempoTerminado] = useState(false);

  

  useEffect(() => {
    if (props.tiempo === "00:00:00") {
      setTiempoTerminado(true);
    }

    if (tiempoTerminado && showModal) {
      handleCloseModal();
    }
  }, [props.tiempo,tiempoTerminado, showModal]);
  

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const contenidoSI = <p>Se acabo la subasta de este producto</p>
  const contenidoNO = <button onClick={handleShowModal}>Haz un BID</button>
  
  return (
    <div className="card-container">
      <div className="card">
        <img
          className="product--image"
          src={props.imagen}
          alt="product image"
        />
        <h2 className=" mt-3">{props.nombre}</h2>
        <p className="price">{props.precio_base}</p>
        <p>{props.description}</p>
        <p>
          {/* <button onClick={handleShowModal}>Haz un BID</button> */}
          {tiempoTerminado ? contenidoSI : contenidoNO}
        </p>
        <p>
          {/* <Timer time={props.tiempo}></Timer> */}
          {props.tiempo}
        </p>
      </div>

      <MakeBid
        show={showModal}
        handleCloseModal={handleCloseModal}
        titulo={props.nombre}
        foto={props.imagen}
        precioBase={props.precio_base}
        porcentaje={props.porcentaje}
        tiempo={props.tiempo}
      />
    </div>
  );
};

export default CardProductos;