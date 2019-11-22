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
      <section>
        <img src={user.picture} alt="Profile" style={{ marginTop: 20 }} />

        <table>
          <tbody>
            <tr
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <td>
                {Object.keys(user).map(x =>
                  x === "picture" ? null : <p key={x}>{x}</p>,
                )}
              </td>
              <td>
                {Object.values(user).map((x, i) =>
                  user["picture"] === x ? null : <p key={i}>{x}</p>,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </React.Fragment>
  );
};

export { Profile };
