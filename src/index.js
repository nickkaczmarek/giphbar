import React from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import { Home } from "./components/home.js";
import { Saved } from "./components/saved.js";
import { Upload } from "./components/upload.js";
import Logo from "./components/logo.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const App = ({ children }) => (
  <section id="container">
    <Logo />
    <nav>
      <Link to="/">Home</Link> <Link to="saved">Saved</Link>{" "}
      <Link to="upload">Upload</Link>
    </nav>
    <Router>
      <Home path="/" />
      <Saved path="saved" />
      <Upload path="upload" />
    </Router>
  </section>
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

if (module.hot) {
  module.hot.accept();
}
