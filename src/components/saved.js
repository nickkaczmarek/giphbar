import React from "react";
import { Img } from "./Img";

function Saved() {
  const [images, setImages] = React.useState(
    JSON.parse(localStorage.getItem("data")),
  );

  return (
    <React.Fragment>
      {images && images.length ? (
        <section className="gif-container">
          {" "}
          {images.map(img => (
            <figure key={img.id}>
              <Img
                src={img.webp}
                alt={img.title}
                id={img.id}
                onClick={() => navigator.clipboard.writeText(img.url)}
              />
              <button
                onClick={() => {
                  let data = JSON.parse(localStorage.getItem("data")) || [];
                  let items = data.filter(i => i.id !== img.id);
                  localStorage.setItem("data", JSON.stringify(items));
                  setImages(JSON.parse(localStorage.getItem("data")));
                }}>
                X
              </button>
            </figure>
          ))}
        </section>
      ) : (
        <h1>
          Things will show up here when you search for and click gifs on the
          other page
        </h1>
      )}
    </React.Fragment>
  );
}
export { Saved };
