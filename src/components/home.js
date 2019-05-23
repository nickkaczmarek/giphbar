import React, { useState, useEffect, createRef, Fragment } from "react";
import { search, runIfProd, useLocalStorage } from "../utils";
import { Img } from "./Img";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  let inputRef = createRef();
  let [lastQuery, setLastQuery] = useLocalStorage("query", "");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function checkForLastQuery() {
      if (lastQuery) {
        setData(await search(lastQuery));
      }
    }
    checkForLastQuery();
  }, [lastQuery]);

  return (
    <Fragment>
      <input
        value={inputValue}
        placeholder={`Search for a gif`}
        ref={inputRef}
        autoFocus={true}
        onChange={event => setInputValue(event.target.value)}
        onKeyPress={async event => {
          if (event.key === "Enter") {
            setData(await search(inputValue));
            setLastQuery(inputValue);
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
                let isAlreadyInStorage = data.find(x => x.id === img.id);
                if (!isAlreadyInStorage) {
                  data.push(img);
                  localStorage.setItem("data", JSON.stringify(data));
                }
                runIfProd(() => inputRef.current.focus());
              }}
            />
          ))}
        </section>
      ) : null}
    </Fragment>
  );
}

export { Home };
