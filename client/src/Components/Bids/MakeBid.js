import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { MDBInput } from "mdb-react-ui-kit";
import Timer from "./Timer";
import "./MakeBid_estilos.css";
const MakeBid = (props) => {
  const [tiempoAleatorio, setTiempoAleatorio] = useState("");
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
  return (
    <Modal
      show={props.show}
      onHide={props.handleCloseModal}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className="modal-title">{props.titulo}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="row row-cols-2">
          <Col className="">
            <img src={props.foto} className="modal-image"></img>
          </Col>

          <Col className="d-flex flex-column justify-content-between">
            <Row className="align-items-center">
              <h3 className="modal-subtitle">
                Precio Base:{props.precioBase}$
              </h3>
            </Row>
            <Row className="align-items-center">
              <h3 className="modal-subtitle">Ultimo BID:200$</h3>
            </Row>
            <Row className="align-items-center">
              <h3 className="modal-subtitle">Minimo Aumento:{props.porcentaje*100}%</h3>
            </Row>
            <Row className="align-items-center">
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Haz tu BID"
                id="formControlLg"
                size="lg"
              />
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row
          className="row row-cols-2"
          style={{ justifyContent: "space-between", alignItems: "center", width: '100%', margin: 0 }}
        >
          <Col className="d-flex align-items-center">
            {/* <Timer tiempo={tiempoAleatorio}></Timer> */}
            <h2 className="modal-timer">{props.tiempo}</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button onClick={props.handleCloseModal} style={{fontSize: '1.29rem', backgroundColor: '#B5915E', border: 'none'}}>
              HACER BID
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default MakeBid;
