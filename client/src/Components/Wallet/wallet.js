import React from "react";

//import "./Wallet_Estilo.css";
import "./Estilo_Cartera.css";
import WalletIcon from "./Walleticon";
import wallet from "../../assets/bxs-wallet.svg";
import { Card, Col, Row } from "react-bootstrap";

const Wallet = (props) => {
  return (
    // <Row className="row row-cols-2 d-flex" style={{backgroundColor: "rgba(181, 145, 94, 0.8)"}}>
    //   <Col className="align-items-start">
    //     <p className="titulo-cartera mx-2"> Hola, Victor Manuel</p>
    //   </Col>

    //   <Col className="align-items-start">
    //   <p>35 bolos</p>
    //   </Col>
    // </Row>
    <Row
      className="row row-cols-2"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: 0,
        backgroundColor: "rgba(181, 145, 94, 0.8)",
      }}
    >
      <Col className="d-flex align-items-center">
        <h2 className="titulo-cartera">
          Hola {props.nombre} Tienes {props.cartera}$
        </h2>
      </Col>
      <Col className="d-flex justify-content-end">
        <Row
          className="row row-cols-2 redondo justify-content-end"
          style={{ width: "fit-content" }}
        >
          <Col className="" style={{ width: "fit-content" }}>
            <WalletIcon></WalletIcon>
          </Col>
          <Col
            className="d-flex justify-content-center"
            style={{ width: "fit-content" }}
          >
            <h2 className="subtitulo-cartera ">{props.cartera} $</h2>
          </Col>
        </Row>
      </Col>
      {/* <Col className={classes.button}>
        <span className={classes.icon}>
          <WalletIcon></WalletIcon>
        </span>
        <span>Tu budget</span>
        <span className={classes.badge}>1500 $</span>
      </Col> */}
    </Row>
  );
};

export default Wallet;
