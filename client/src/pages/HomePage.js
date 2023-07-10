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
import "./Notificacion.css"
const HomePage = () => {
  const [isLoading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const [productoMinuto, setProductoMinuto] = useState("");
  const [productoTerminado, setProductoTerminado] = useState("");


  // useEffect(() => {
  //   fetch("http://localhost:5000/productos")
  //     .then(response => response.json())
  //     .then(data => {
  //       setProductos(data.productos)
  //       console.log(productos)
  //       setLoading(false)
  //     });
  // }, []);

  useEffect(() => {
    fetch("http://localhost:5000/productos")
      .then((response) => response.json())
      .then((data) => {
        const nuevosProductos = data.productos.map((producto) => {
          const intervalId = setInterval(() => {
            actualizarTiempo(producto.id);
          }, 1000);

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
                  key={producto.id}
                  imagen={
                    producto.id === 1
                      ? casco
                      : producto.id === 2
                      ? camisa
                      : producto.id === 3
                      ? bota
                      : producto.id === 4
                      ? jersey
                      : suit
                  }
                  nombre={producto.nombre}
                  id={producto.id}
                  precio_base={producto.precio_base}
                  tiempo={producto.tiempo}
                  porcentaje={producto.porcentaje}
                ></CardProductos>
              ))}
            </Carousel>
          </Row>
          <Toast show={showToast} onClose={() => setShowToast(false)} autohide className="notificacion" stacked>
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
