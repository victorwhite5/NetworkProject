import {
  MDBBtn,
  MDBCardImage,
  MDBContainer,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [Subastas, setSubastas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subasta, setsubasta] = useState(false);
  const [monto, setMonto] = useState();

  const toggleModal = (event) => {
    console.log(event.target.value);
    setsubasta(event.target.value);
    setShowModal(!showModal);
  };

  const getSubastas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subastas");
      const jsonData = await response.json();
      console.log(jsonData);
      setSubastas(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleOferta = async () => {
    try {
      const body = {
        monto,
        subasta,
      };
      const response = await fetch("http://localhost:5000/api/hacerOferta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error al mandar los datos de la oferta:", error);
    }
  };

  const handleMonto = (event) => {
    setMonto(event.target.value);
  };

  useEffect(() => {
    getSubastas();
  }, []);

  return (
    <MDBContainer>
      {Subastas.map((subasta) => (
        <div>
          <MDBCardImage src={`data:image/jpeg;base64,${subasta.IMAGEN_PRO}`} />
          <MDBBtn
            value={subasta.COD_SUB}
            onClick={toggleModal}
            data-mdb-toggle="modal"
            data-mdb-target="#staticBackdrop"
          >
            Hacer Bid
          </MDBBtn>
        </div>
      ))}

      <MDBModal show={showModal} setShow={setShowModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Monto"
                id="typeNumber"
                type="number"
                onChange={handleMonto}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleOferta}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
};

export default HomePage;
