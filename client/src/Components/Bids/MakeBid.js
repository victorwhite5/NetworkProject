import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { MDBCardImage, MDBInput } from "mdb-react-ui-kit";
import Timer from "./Timer";
import "./MakeBid_estilos.css";
const MakeBid = (props) => {
  const [tiempoAleatorio, setTiempoAleatorio] = useState("");
  const [monto_oferta, setMonto_Oferta] = useState();
  useEffect(() => {
    const tiempoGenerado = generarTiempoAleatorio();
    setTiempoAleatorio(tiempoGenerado);
  }, []);
  function generarTiempoAleatorio() {
    const min = 1;
    const max = 4;
    const tiempoEnMinutos = Math.floor(Math.random() * (max - min + 1)) + min;
    const tiempoEnMilisegundos = tiempoEnMinutos * 60 * 1000;

    const fecha = new Date(tiempoEnMilisegundos);
    const horas = fecha.getUTCHours().toString().padStart(2, "0");
    const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");
    const segundos = fecha.getUTCSeconds().toString().padStart(2, "0");

    return `${horas}:${minutos}:${segundos}`;
  }
  const handleOferta = async (event) => {
    event.preventDefault();
    if (props.ofertante) {
      if (monto_oferta < props.monto * props.porcentaje) {
        console.log("la oferta realiza no es suficiente");
        return;
      } else if (props.ofertante == props.usuario) {
        console.log("El ofertante actual es " || props.nombre);
        return;
      }
    } else if (monto_oferta < props.monto) {
      console.log("la oferta realiza no es suficiente");
      return;
    }
    const subasta = props.subasta;
    const ofertante = props.usuario;
    console.log(monto_oferta, subasta, ofertante);
    props.handleNuevaOferta(monto_oferta, subasta, ofertante);
    try {
      const body = {
        monto_oferta,
        subasta,
        ofertante,
      };
      const response = await fetch(
        "http://192.168.0.127:5000/api/hacerOferta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error al mandar los datos de la oferta:", error);
    }
    try {
      const body = {
        monto_oferta,
        subasta,
        ofertante,
      };
      const response = await fetch(
        "http://192.168.0.127:5000/api/actualizarDatosSubasta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error al mandar los datos de la oferta:", error);
    }
  };

  const handleMonto = (event) => {
    setMonto_Oferta(event.target.value);
  };
  return (
    <Modal
      show={props.show}
      onHide={props.handleCloseModal}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <form onSubmit={handleOferta}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="modal-title">{props.titulo}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="row row-cols-2">
            <Col className="">
              <MDBCardImage
                className="modal-image"
                src={`data:image/jpeg;base64,${props.foto}`}
              />
            </Col>

            <Col className="d-flex flex-column justify-content-between">
              <Row className="align-items-center">
                <h3 className="modal-subtitle">
                  Precio Base: {props.precioBase}$
                </h3>
              </Row>
              <Row className="align-items-center">
                <p className="modal-subtitle">Bid actual: {props.monto}</p>
              </Row>
              <Row className="align-items-center">
                <p className="modal-subtitle">Por: {props.ofertante}</p>
              </Row>
              <Row className="align-items-center">
                <h3 className="modal-subtitle">
                  Minimo Aumento: {props.porcentaje}%
                </h3>
              </Row>
              <Row className="align-items-center">
                <h3 className="modal-subtitle">
                  Proximo Bid: {props.monto * (1 + props.porcentaje * 0.01)} $
                </h3>
              </Row>
              <Row className="align-items-center">
                <MDBInput
                  wrapperClass="mb-4"
                  placeholder="Haz tu BID"
                  id="formControlLg"
                  size="lg"
                  type="number"
                  onChange={handleMonto}
                  value={monto_oferta}
                />
              </Row>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row
            className="row row-cols-2"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: 0,
            }}
          >
            <Col className="d-flex align-items-center">
              {/* <Timer tiempo={tiempoAleatorio}></Timer> */}
              <h2 className="modal-timer">{props.tiempo}</h2>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                type="submit"
                onClick={props.handleCloseModal}
                style={{
                  fontSize: "1.29rem",
                  backgroundColor: "#B5915E",
                  border: "none",
                }}
              >
                HACER BID
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default MakeBid;
