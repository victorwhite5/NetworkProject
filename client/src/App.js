import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ServerPage from "./pages/serverPage";
import ProductoPage from "./pages/ProductoPage";
import Fondo from "../src/assets/fondoPrincipal1.png";
import { ContextSocketProvider } from "./context/context-socketio";

const App = () => {
  return (
    <ContextSocketProvider>
      <Switch>
        <Route path="/" exact>
          {/* {isLoggedIn ? <Redirect to="/home" /> : <LoginPage setLoggedIn={setLoggedIn} />} */}
          <Redirect to="/login" />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/server" exact>
          <ServerPage />
        </Route>

        <Route path="/home">
          {/* {isLoggedIn ? <HomePage /> : <Redirect to="/" />} */}
          <HomePage></HomePage>
          {/* <HomePage /> */}
        </Route>
      </Switch>
    </ContextSocketProvider>
  );
};

export default App;
