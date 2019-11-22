import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import { Home } from "./components/home.js";
import { Saved } from "./components/saved.js";
import { Upload } from "./components/upload.js";
import { Profile } from "./components/Profile.js";
import Logo from "./components/logo.js";
import Navbar from "./components/Navbar.js";
import { useAuth0 } from "./react-auth0-wrapper";
import PrivateRoute from "./components/PrivateRoute.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-wrapper";
import { isProd } from "./utils";
import configProd from "./auth_config.json";
import configDev from "./auth_config.dev.json";

import { initFirebase } from "./firebase";
initFirebase();

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="container">
      <Logo />
      <Navbar />
      <Router>
        <Home path="/" />
        <PrivateRoute path="saved" component={Saved} />
        <Upload path="upload" />
        <PrivateRoute path="/profile" component={Profile} />
      </Router>
    </section>
  );
};

let config = configProd;
// if (isProd()) {
//   config = configProd;
// } else {
//   config = configDev;
// }

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

if (module.hot) {
  module.hot.accept();
}
