import { MDBCardImage, MDBContainer } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [productos, setProductos] = useState([]);

  const getProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/productos");
      const jsonData = await response.json();
      console.log(jsonData);
      setProductos(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <MDBContainer>
      {productos.map((producto) => (
        <MDBCardImage
          src={`data:image/jpeg;base64,${producto.IMAGEN_PRO}`}
          rounded
          fluid
        />
      ))}
    </MDBContainer>
  );
};

export default HomePage;
