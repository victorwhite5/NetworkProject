import React from 'react'
import { Fragment } from 'react'
import { Image } from "react-bootstrap";

import Fondo from '../../assets/fondo.jpg'
const Layout = (props) => {
  return (
    <Fragment>
      <Image src={Fondo}></Image>
      <main>{props.children}</main>
    </Fragment>
  )
}

export default Layout
