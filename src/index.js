import React from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import { Home } from "./components/home.js";
import { Saved } from "./components/saved.js";
import Logo from "./components/logo.js";
import "./index.css";

const App = ({ children }) => (
  <React.Fragment>
    <Logo />
    <nav>
      <Link to="/">Home</Link> <Link to="saved">Saved</Link>
    </nav>
    <Router>
      <Home path="/" />
      <Saved path="saved" />
    </Router>
  </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
