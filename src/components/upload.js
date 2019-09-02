import React from "react";
import { isSafari, updateGifsInLocalStorage } from "../utils";

function Upload() {
  const [title, setTitle] = React.useState("");
  const [url, setURL] = React.useState("");
  const [images, setImages] = React.useState(JSON.parse(localStorage.getItem("data")));

  return (
    <React.Fragment>
      <h3>Add a title and a gif url</h3>
      <form>
        <input placeholder={"Title"} name={"title"} value={title} onChange={event => setTitle(event.target.value)} />
        <input placeholder={"URL"} name={"url"} value={url} onChange={event => setURL(event.target.value)} />
        <button
          type={"submit"}
          onClick={event => {
            event.preventDefault();
            const { title, url } = event.target.form;
            updateGifsInLocalStorage({
              id: title.value,
              title: title.value,
              safari: url.value,
              url: url.value,
              webp: url.value,
            });
            window.location.reload();
          }}
        >
          Submit
        </button>
      </form>
      {images && images.length ? (
        <section>
          <table style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {images.map(img => (
                <tr key={img.id}>
                  <td>
                    <img
                      className={"upload-image"}
                      src={isSafari() ? img.safari : img.webp}
                      alt={img.title}
                      id={img.id}
                      onClick={() => navigator.clipboard.writeText(img.url)}
                    />
                  </td>
                  <td>{img.title}</td>
                  <td>
                    <button
                      onClick={() => {
                        let data = JSON.parse(localStorage.getItem("data")) || [];
                        let items = data.filter(i => i.id !== img.id);
                        localStorage.setItem("data", JSON.stringify(items));
                        setImages(JSON.parse(localStorage.getItem("data")));
                      }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <h1>Things will show up here when you search for and click gifs on the other page</h1>
      )}
    </React.Fragment>
  );
}
export { Upload };
