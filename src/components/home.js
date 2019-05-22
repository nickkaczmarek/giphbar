import React, { useState, useEffect, createRef, Fragment } from "react";
import { search, runIfProd } from "../utils";
import { Img } from "./Img";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  let inputRef = createRef();
  let lastQuery = localStorage.getItem("query");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    runIfProd(() => inputRef.current.focus());
    async function checkForLastQuery() {
      if (lastQuery) {
        setData(await search(lastQuery));
      }
    }
    checkForLastQuery();
    return () => {
      lastQuery = "";
    };
  }, [inputValue, lastQuery]);

  return (
    <Fragment>
      <input
        value={inputValue}
        placeholder={`Search for a gif`}
        ref={inputRef}
        onChange={event => setInputValue(event.target.value)}
        onKeyPress={async event => {
          if (event.key === "Enter") {
            setData(await search(inputValue));
            localStorage.setItem("query", inputValue);
          }
        }}
      />
      {data ? (
        <section className="gif-container">
          {" "}
          {data.map(img => (
            <Img
              src={img.webp}
              alt={img.title}
              key={img.id}
              id={img.id}
              onClick={() => {
                navigator.clipboard.writeText(img.url);
                let data = JSON.parse(localStorage.getItem("data")) || [];
                let isAlreadyInStorage = data.filter(x => x.id === img.id)
                  .length
                  ? true
                  : false;
                if (!isAlreadyInStorage) {
                  data.push(img);
                  localStorage.setItem("data", JSON.stringify(data));
                }
              }}
            />
          ))}
        </section>
      ) : null}
    </Fragment>
  );
}

export { Home };
