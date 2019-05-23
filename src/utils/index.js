import { useLocalStorage } from "./useLocalStorage";

/**
 * Use this to search the giphy api
 *
 * @param {string} query
 */
async function search(query) {
  const apiKey = "CAucImDiFvcD00x7ZqHSm4zcXL9Ui22d";
  const url = "https://api.giphy.com/v1/gifs/search";

  const response = await fetch(
    `${url}?q=${query}&api_key=${apiKey}&limit=20&rating=g`,
    { cache: "reload" },
  );
  const json = await response.json();

  return json.data.map(img => ({
    webp: img.images.fixed_width_downsampled.webp,
    url: img.images.original.url,
    id: img.id,
    title: img.title,
  }));
}

/**
 * Use this to avoid running certain functions in development
 *
 * @example
 *
 *    runIfProd(functThatAutoFocusesInput());
 *
 * @param {function} cb
 */
function runIfProd(cb) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    console.log("Something would be running in prod right about now.");
  } else {
    cb();
    // production code
  }
}

export { search, runIfProd, useLocalStorage };
