import React, { useState, useEffect, createRef, Fragment } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  let imgRef = createRef();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    imgRef.current.focus();
  });

  return (
    <Fragment>
      <h1>giphbar</h1>
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
                const that = this;
                navigator.clipboard.writeText(img.url).then(
                  function() {
                    that.setState({ copySuccess: "Copied!" });
                    setTimeout(
                      () => that.setState({ copySuccess: null }),
                      3000
                    );
                    /* clipboard successfully set */
                  },
                  function() {
                    /* clipboard write failed */
                  }
                );
              }}
            />
          ))}
        </section>
      ) : null}
    </Fragment>
  );
}

async function search(query) {
  const apiKey = "CAucImDiFvcD00x7ZqHSm4zcXL9Ui22d";
  const url = "https://api.giphy.com/v1/gifs/search";

  const response = await fetch(
    `${url}?q=${query}&api_key=${apiKey}&limit=20&rating=g`
  );
  const json = await response.json();

  return json.data.map(img => ({
    webp: img.images.fixed_width_downsampled.webp,
    url: img.images.original.url,
    id: img.id
  }));
}

ReactDOM.render(<App />, document.getElementById("root"));
