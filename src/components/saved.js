import React from "react";

function Saved() {
  let data = JSON.parse(localStorage.getItem("data")) || {};

  return (
    <React.Fragment>
      {data ? (
        <section className="container">
          {" "}
          {data.map(img => (
            <img
              src={img}
              alt={img}
              key={img}
              id={img}
              onClick={() => navigator.clipboard.writeText(img.url)}
            />
          ))}
        </section>
      ) : null}
    </React.Fragment>
  );
}
export { Saved };
