import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProductoPage from "./pages/ProductoPage";
import Fondo from "../src/assets/fondoPrincipal1.png";
const App = () => {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  // const [data, setData] = useState ([{}])
  //   const [isLoading, setIsLoading]= useState(true)
  //   useEffect(() => {
  //     fetch("http://192.168.0.8:5000").then(
  //       res => res.json()
  //     ).then(
  //         data => {
  //             setData(data)
  //             console.log(data)
  //             setIsLoading(false)
  //         }
  //     )
  //   }, [])
  return (
    <Switch>
      <Route path="/" exact>
        {/* {isLoggedIn ? <Redirect to="/home" /> : <LoginPage setLoggedIn={setLoggedIn} />} */}
        <Redirect to="/login" />
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/home">
        {/* {isLoggedIn ? <HomePage /> : <Redirect to="/" />} */}
        <HomePage />
      </Route>

      <Route path="/home/:productoId">
        <ProductoPage />
      </Route>
    </Switch>
  );
};


export default App;
