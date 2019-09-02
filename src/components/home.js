import React, { useState, useEffect, createRef, Fragment } from "react";
import {
  search,
  runIfProd,
  useLocalStorage,
  Clipboard,
  isSafari,
  updateGifsInLocalStorage,
} from "../utils";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  let inputRef = createRef();
  let [lastQuery, setLastQuery] = useLocalStorage("query", "");
  let [rating, setRating] = useState("g");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function checkForLastQuery() {
      if (lastQuery) {
        setData(await search(lastQuery, rating));
      }
    }
    checkForLastQuery();
  }, [lastQuery, rating]);

  return (
    <Fragment>
      <section id="input-container">
        <input
          value={inputValue}
          placeholder={`Search for a gif`}
          ref={inputRef}
          autoFocus={true}
          onChange={event => setInputValue(event.target.value)}
          onKeyPress={async event => {
            if (event.key === "Enter") {
              setData(await search(inputValue, rating));
              setLastQuery(inputValue);
            }
          }}
        />
        <select
          onChange={async event => {
            setRating(event.target.value);
            await setData(await search(lastQuery, event.target.value));
          }}
        >
          <option value={"g"}>Select a Rating</option>
          <option value={"g"}>RATING: G</option>
          <option value={"pg"}>RATING: PG</option>
          <option value={"pg-13"}>RATING: PG-13</option>
          <option value={"r"}>RATING: R</option>
        </select>
      </section>
      {data ? (
        <section className="gif-container">
          {" "}
          {data.map(img => (
            <img
              className={"image"}
              src={isSafari() ? img.safari : img.webp}
              alt={img.title}
              key={img.id}
              id={img.id}
              onClick={event => {
                if (isSafari()) {
                  Clipboard.copy(img.url);
                } else {
                  navigator.clipboard.writeText(img.url);
                }
                updateGifsInLocalStorage(img);
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
