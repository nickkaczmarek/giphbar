import React, { useState, useEffect, createRef, Fragment } from "react";
import { search, runIfProd, useLocalStorage, Clipboard } from "../utils";
import { Img } from "./Img";

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

  const isSafari = () => {
    /*
     * Browser detection
     * @return {String}
     */
    const browserDetection = () => {
      const browsers = {
        firefox: !!window.InstallTrigger,
        safari: !!window.ApplePaySession,
        opera: window.opr && !!window.opr.addons,
        chrome: window.chrome && !!window.chrome.webstore
      };

      return Object.keys(browsers).find(key => browsers[key] === true);
    };

    return browserDetection() === "safari";
  };

  

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
            <Img
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
