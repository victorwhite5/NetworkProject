import React from "react";
import { Button, Container } from "react-bootstrap";

function serverPage() {
  const handleInicio = async (event) => {
    try {
      const body = {};
      const response = await fetch("http://192.168.0.127:5000/api/inicio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(true),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error al mandar los datos de la oferta:", error);
    }
  };

  return (
    <Container>
      <Button onClick={handleInicio} className="btn-success">
        Inicio
      </Button>
      <Button>Fin</Button>
    </Container>
  );
}

export default serverPage;
