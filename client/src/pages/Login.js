import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsuario = (e) => {
    setUsername(e.target.value);
  };

  const handleContrasena = (e) => {
    setPassword(e.target.value);
  };

  const sendData = async () => {
    try {
      const body = {
        username,
        password,
      };
      const response = await fetch(
        "http://192.168.0.37:5000/api/datosUsuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = await response.json();
      console.log(json);
      if (json[1]) {
        const cod = json[2].COD_CLI;
        const nombre = json[2].NOMBRE_CLI;
        const usuario = json[2].USUARIO_CLI;
        const cartera = json[2].CARTERA_CLI;
        const ip = json[3];
        try {
          const body = {
            cod,
            nombre,
            usuario,
            cartera,
            ip,
          };
          fetch("http://192.168.0.37:5000/api/hilo_usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.error("Error al intentar crear el hilo", error);
        }
        window.location = "/home";
      }
    } catch (error) {
      console.error("Error al mandar los datos del login:", error);
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc5MDE3MzgxMzUwMjIxMzE5/1179394906.jpg"
            class="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Usuario"
            id="formControlLg"
            type="usuario"
            size="lg"
            onChange={handleUsuario}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="formControlLg"
            type="password"
            size="lg"
            onChange={handleContrasena}
          />

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg" onClick={sendData}>
              Login
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account?{" "}
              <a href="#!" className="link-danger">
                Register
              </a>
            </p>
          </div>
        </MDBCol>
      </MDBRow>

      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>

        <div>
          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="facebook-f" size="md" />
          </MDBBtn>

          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="twitter" size="md" />
          </MDBBtn>

          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="google" size="md" />
          </MDBBtn>

          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="linkedin-in" size="md" />
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
};

export default Login;
