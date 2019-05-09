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

function runIfProd(cb) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
  } else {
    cb();
    // production code
  }
}

export { search, runIfProd };
