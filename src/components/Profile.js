// src/components/Profile.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <section style={{ display: "grid", justifyItems: "center", alignItems: "center" }}>
        <img src={user.picture} alt="Profile" style={{ marginTop: 20 }} />

        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <code>{JSON.stringify(user, null, 2)}</code>
      </section>
    </React.Fragment>
  );
};

export { Profile };
