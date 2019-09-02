// src/components/NavBar.js

import React from "react";
import { Link } from "@reach/router";

import { useAuth0 } from "../react-auth0-wrapper";

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav>
      <Link to="/">Home</Link> <Link to="saved">Saved</Link> <Link to="upload">Upload</Link>{" "}
      {isAuthenticated && <Link to="profile">Profile</Link>}{" "}
      {!isAuthenticated && <button onClick={() => loginWithRedirect({})}>Log in</button>}
      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </nav>
  );
};

export default Navbar;
