import React, { useState, useEffect, createRef, Fragment } from "react";
import { search, runIfProd } from "../utils";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  let imgRef = createRef();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    runIfProd(() => imgRef.current.focus());
  });

  return (
    <Fragment>
      <input
        value={inputValue}
        placeholder={`Search for something`}
        ref={imgRef}
        onChange={event => setInputValue(event.target.value)}
        onKeyPress={async event => {
          if (event.key === "Enter") {
            setData(await search(inputValue));
          }
        }}
      />
      {data ? (
        <section className="container">
          {" "}
          {data.map(img => (
            <img
              src={img.webp}
              alt={img.id}
              key={img.id}
              id={img.id}
              onClick={() => {
                navigator.clipboard.writeText(img.url);
                let data = JSON.parse(localStorage.getItem("data")) || [];
                data.push(img.url);
                localStorage.setItem("data", JSON.stringify(data));
                console.log(JSON.parse(localStorage.getItem("data")));
              }}
            />
          ))}
        </section>
      ) : null}
    </Fragment>
  );
}

export { Home };
