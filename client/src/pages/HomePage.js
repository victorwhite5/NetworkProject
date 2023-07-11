// import {
//   MDBBtn,
//   MDBCardImage,
//   MDBContainer,
//   MDBInput,
//   MDBModal,
//   MDBModalBody,
//   MDBModalContent,
//   MDBModalDialog,
//   MDBModalFooter,
//   MDBModalHeader,
//   MDBModalTitle,
// } from "mdb-react-ui-kit";
// import React, { useEffect, useState } from "react";

// const HomePage = () => {
//   const [Subastas, setSubastas] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [subasta, setsubasta] = useState(false);
//   const [monto, setMonto] = useState();

//   const toggleModal = (event) => {
//     console.log(event.target.value);
//     setsubasta(event.target.value);
//     setShowModal(!showModal);
//   };

//   const handleOferta = async () => {
//     try {
//       const body = {
//         monto,
//         subasta,
//       };
//       const response = await fetch("http://localhost:5000/api/hacerOferta", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error("Error al mandar los datos de la oferta:", error);
//     }
//   };

//   const handleMonto = (event) => {
//     setMonto(event.target.value);
//   };

//   useEffect(() => {
//     getSubastas();
//   }, []);

//   return (
//     <MDBContainer>
//       {Subastas.map((subasta) => (
//         <div>
//           <MDBCardImage src={`data:image/jpeg;base64,${subasta.IMAGEN_PRO}`} />
//           <MDBBtn
//             value={subasta.COD_SUB}
//             onClick={toggleModal}
//             data-mdb-toggle="modal"
//             data-mdb-target="#staticBackdrop"
//           >
//             Hacer Bid
//           </MDBBtn>
//         </div>
//       ))}

//       <MDBModal show={showModal} setShow={setShowModal} tabIndex="-1">
//         <MDBModalDialog>
//           <MDBModalContent>
//             <MDBModalHeader>
//               <MDBModalTitle>Modal title</MDBModalTitle>
//               <MDBBtn
//                 className="btn-close"
//                 color="none"
//                 onClick={toggleModal}
//               ></MDBBtn>
//             </MDBModalHeader>
//             <MDBModalBody>
//               <MDBInput
//                 label="Monto"
//                 id="typeNumber"
//                 type="number"
//                 onChange={handleMonto}
//               />
//             </MDBModalBody>

//             <MDBModalFooter>
//               <MDBBtn color="secondary" onClick={toggleModal}>
//                 Close
//               </MDBBtn>
//               <MDBBtn onClick={handleOferta}>Save changes</MDBBtn>
//             </MDBModalFooter>
//           </MDBModalContent>
//         </MDBModalDialog>
//       </MDBModal>
//     </MDBContainer>

import React, { useState, useEffect, Fragment } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Image,
  Button,
  Toast,
} from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import casco from "../assets/helmet (1).jpg";
import camisa from "../assets/eldiego.jpg";
import bota from "../assets/gb.jpg";
import jersey from "../assets/jordan12.jpg";
import suit from "../assets/hamsuit.jpg";
import Fondo from "../assets/fondoPrincipal1.png";
import Flayer from "../assets/dinhoofi.png";
import CardProductos from "../Components/Products/CardProductos";
import "./Titulo.css";
import "./Notificacion.css";
const HomePage = () => {
  const [isLoading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const [productoMinuto, setProductoMinuto] = useState("");
  const [productoTerminado, setProductoTerminado] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/obtenerSubastas")
      .then((response) => response.json())
      .then((productos) => {
        const nuevosProductos = productos.map((producto) => {
          const intervalId = setInterval(() => {
            actualizarTiempo(producto.id);
          }, 1000);
          console.log(productos);
          return {
            ...producto,
            intervalId: intervalId,
          };
        });

        setProductos(nuevosProductos);
        setLoading(false);
      });

    return () => {
      productos.forEach((producto) => {
        clearInterval(producto.intervalId);
      });
    };
  }, []);

  const actualizarTiempo = (id) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) => {
        if (producto.id === id) {
          const tiempo = restarUnSegundo(producto.tiempo);
          if (tiempo === "00:01:00") {
            setShowToast(true);
            setProductoMinuto(producto.nombre);
          }
          if (tiempo === "00:00:00") {
            clearInterval(producto.intervalId);
            setProductoTerminado(producto.nombre);
          }
          return {
            ...producto,
            tiempo: tiempo,
          };
        }
        return producto;
      })
    );
  };

  const restarUnSegundo = (tiempo) => {
    const [horas, minutos, segundos] = tiempo.split(":").map(Number);
    const totalSegundos = horas * 3600 + minutos * 60 + segundos - 1;
    const nuevaHora = Math.floor(totalSegundos / 3600);
    const nuevoMinuto = Math.floor((totalSegundos % 3600) / 60);
    const nuevoSegundo = totalSegundos % 60;
    return `${nuevaHora < 10 ? "0" : ""}${nuevaHora}:${
      nuevoMinuto < 10 ? "0" : ""
    }${nuevoMinuto}:${nuevoSegundo < 10 ? "0" : ""}${nuevoSegundo}`;
  };

  if (isLoading) return <h1>Cargando...</h1>;

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const styles = {
    backgroundImage: `url(${Fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "top center",
    height: "100vh",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    width: "100%",
  };
  const styles2 = {
    backgroundColor: "#B5915E",
  };

  return (
    <Fragment>
      <div style={styles}>
        <Container style={{ height: "100%" }}>
          <Row
            className="row row-cols-2 text-center justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <Col>
              <Image src={Flayer} width={600} height={480}></Image>
            </Col>

            <Col>
              <h1 className="subtitle">
                ACA TENEMOS QUE PONER FULL TEXTO, BURDA BURDA ASI TIPO HAZ FULL
                BIDS COMO EL DINHO
              </h1>
            </Col>
          </Row>
        </Container>
      </div>

      <div style={styles2}>
        <Container className="">
          <Row className="text-center">
            <h1 className="title">PRODUCTOS DISPONIBLES</h1>
          </Row>
          <Row className="">
            <Carousel responsive={responsive} className="mb-5">
              {productos.map((producto) => (
                <CardProductos
                  key={producto.COD_SUB}
                  subasta={producto.COD_SUB}
                  imagen={producto.IMAGEN_PRO}
                  nombre={producto.NOMBRE_PRO}
                  id={producto.COD_SUB}
                  precio_base={producto.PRECIO_BASE}
                  tiempo={producto.tiempo}
                  porcentaje={producto.PORCENTAJE_SUPERA}
                  ofertante={producto.ofertante}
                  monto={producto.monto}
                ></CardProductos>
              ))}
            </Carousel>
          </Row>
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            autohide
            className="notificacion"
            stacked
          >
            <Toast.Header>
              <strong className="mr-auto">Notificación</strong>
            </Toast.Header>
            <Toast.Body>
              El tiempo de {productoMinuto} ha llegado a 1 minuto.
            </Toast.Body>
          </Toast>

          <Toast
            show={productoTerminado !== ""}
            onClose={() => setProductoTerminado("")}
            autohide
            className="notificacion"
            stacked
          >
            <Toast.Header>
              <strong className="mr-auto">Notificación</strong>
            </Toast.Header>
            <Toast.Body>
              El tiempo de {productoTerminado} se ha agotado.
            </Toast.Body>
          </Toast>
        </Container>
      </div>
    </Fragment>
  );
};
export default HomePage;
