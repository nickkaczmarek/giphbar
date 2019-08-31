import { useLocalStorage } from "./useLocalStorage";

/**
 * Use this to search the giphy api
 *
 * @param {string} query
 */
async function search(query, rating) {
  const apiKey = "CAucImDiFvcD00x7ZqHSm4zcXL9Ui22d";
  const url = "https://api.giphy.com/v1/gifs/search";

  const response = await fetch(
    `${url}?q=${query}&api_key=${apiKey}&limit=20&rating=${rating}`,
    { cache: "reload" },
  );
  const json = await response.json();

  return json.data.map(img => ({
    webp: img.images.fixed_width_downsampled.webp,
    safari: img.images.fixed_width_downsampled.url,
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

export const Clipboard = (function(window, document, navigator) {
  var textArea, copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement("textArea");
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    var range, selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  copy = function(text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };

  return {
    copy: copy
  };
})(window, document, navigator);

export { search, runIfProd, useLocalStorage };
