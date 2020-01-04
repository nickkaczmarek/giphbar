// src/components/NavBar.js

import React from "react";
import { Link } from "@reach/router";

import { useAuth0 } from "../react-auth0-wrapper";

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className="nav-bar">
      <Link to="/" id="brand">
        giphbar
      </Link>
      <ul className="nav-links" id="main-nav">
        {isAuthenticated && (
          <>
            <li className="nav-link">
              <Link to="saved">Saved</Link>
            </li>
            <li className="nav-link">
              <Link to="upload">Upload</Link>
            </li>
            <li className="nav-link">
              <Link to="profile" id="profile">
                Profile
              </Link>
            </li>
            <li className="nav-link">
              <button onClick={() => logout()}>Log out</button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <li className="nav-link">
            <button id="login" onClick={() => loginWithRedirect({})}>
              Log in
            </button>
          </li>
        )}
      </ul>
      <button
        id="nav-burger"
        className="nav-toggle"
        onClick={() => {
          const mainNav = document.getElementById("main-nav");
          mainNav.classList.toggle("active");
        }}
      >
        &#9776;
      </button>
    </nav>
  );
};

export default Navbar;
