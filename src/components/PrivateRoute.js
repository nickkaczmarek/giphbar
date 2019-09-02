// src/components/PrivateRoute.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const PrivateRoute = ({ component: Component, path }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (loading || isAuthenticated) {
    return <Component path={path} />;
  } else {
    loginWithRedirect({
      appState: { targetUrl: path },
    });
    return null;
    // const fn = async () => {
    //   await loginWithRedirect({
    //     appState: { targetUrl: path },
    //   });
    // };
    // fn();
    // return null;
  }
};

export default PrivateRoute;
