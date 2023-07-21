import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import MakeBid from "../Bids/MakeBid";
import "./EstiloCard.css";
import Timer from "../Bids/Timer";
import { MDBCardImage } from "mdb-react-ui-kit";

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
  }, [props.tiempo, tiempoTerminado, showModal]);

  const handleShowModal = () => {
    console.log(props.subasta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const contenidoSI = <p>Se acabo la subasta de este producto</p>;
  const contenidoNO = <button onClick={handleShowModal}>Haz un BID</button>;

  return (
    <div className="card-container">
      <div className="card">
        <img
          src={`data:image/jpeg;base64,${props.imagen}`}
          className="product--image"
        />
        <h2 className=" mt-3">{props.nombre}</h2>
        <p className="price">{props.monto}</p>
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
        ofertante={props.ofertante}
        monto={props.monto}
        subasta={props.subasta}
        usuario={props.usuario}
        cartera={props.cartera}
        handleNuevaOferta={props.handleNuevaOferta}
      />
    </div>
  );
};

export default CardProductos;
