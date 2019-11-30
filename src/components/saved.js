import React, { useEffect, useState } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { getGifsForUser, updateGifsForUser, deleteGif } from "../firebase";

import { isSafari, copyImageUrlToClipboard } from "../utils";
const distinct = function(arrArg) {
  const uniqueKeys = [...new Set(arrArg.map(s => s.id))];
  return [...uniqueKeys.map(id => arrArg.find(s => s.id === id))];
};

function Saved() {
  const { isAuthenticated, user: auth0User } = useAuth0();
  const [images, setImages] = useState();

  useEffect(() => {
    function localStorageGifMerge() {
      //if there are gifs to merge with
      if (images) {
        //get gifs
        const localStorageGifs = JSON.parse(localStorage.getItem("data"));
        //if gifs, do the rest, else return
        if (!localStorageGifs || !isAuthenticated) return;
        //save to firebase
        console.log("copying and deleting");
        const gifs = [...images, ...localStorageGifs];
        const gif_Ids = [
          ...images.map(g => g.id),
          ...localStorageGifs.map(g => g.id),
        ];
        updateGifsForUser({
          userEmail: auth0User.email,
          gifs: distinct(gifs),
          gif_Ids: distinct(gif_Ids),
        });
        //remove item from localStorage
        localStorage.removeItem("data");
      }
    }
    localStorageGifMerge();
  });

  useEffect(() => {
    async function getUserFromFirebase() {
      if (isAuthenticated && !images) {
        try {
          let { gifs } = await getGifsForUser(auth0User.email);
          setImages(gifs);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getUserFromFirebase();
  });

  return (
    <React.Fragment>
      {images && images.length ? (
        <section className="gif-container">
          {" "}
          {images.map(img => (
            <figure key={img.id}>
              <img
                className={"image"}
                src={isSafari() ? img.safari : img.webp}
                alt={img.title}
                id={img.id}
                onClick={() => copyImageUrlToClipboard(img)}
              />
              <button
                className="remove-image"
                onClick={async () => {
                  let fbUser = await getGifsForUser(auth0User.email);
                  setImages(fbUser.gifs.filter(x => x.id !== img.id));
                  await deleteGif(fbUser, img);
                }}
              >
                X
              </button>
            </figure>
          ))}
        </section>
      ) : (
        <h1>
          In order to have saved gifs you need to Sign in => Search => Click Gif
        </h1>
      )}
    </React.Fragment>
  );
}
export { Saved };
