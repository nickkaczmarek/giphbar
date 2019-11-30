import React, { useEffect, useReducer, createRef, Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import {
  search,
  runIfProd,
  useLocalStorage,
  copyImageUrlToClipboard,
  isSafari,
} from "../utils";
import { createUser, getGifsForUser, updateGifsForUser } from "../firebase";

const statesEnum = {
  FETCH_STARTED: "FETCH_STARTED",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
  UPDATE_QUERY: "UPDATE_QUERY",
  UPDATE_RATING: "UPDATE_RATING",
};

const initialState = {
  query: "",
  results: null,
  rating: "g",
  page: 0,
  isLoading: false,
  pagination: { offset: 0 },
  meta: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case statesEnum.FETCH_STARTED:
      console.log("fetching");
      return { ...state, isLoading: true };
    case statesEnum.FETCH_SUCCESS:
      console.log("fetch success");
      return { ...action.new_state, isLoading: false };
    case statesEnum.FETCH_FAILURE:
      console.log("fetch failure");
      return { ...state, isLoading: false };
    case statesEnum.UPDATE_QUERY:
      console.log("updating query");
      return { ...state, query: action.query };
    case statesEnum.UPDATE_RATING:
      console.log("updating rating");
      return { ...state, rating: action.rating };
    default:
      return state;
  }
};

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  let inputRef = createRef();
  let [lastQuery, setLastQuery] = useLocalStorage("query", "");
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    async function checkForLastQuery() {
      if (lastQuery && !state.results) {
        const { data: results, pagination, meta } = await search(
          lastQuery,
          state.rating,
        );
        dispatch({
          type: statesEnum.FETCH_SUCCESS,
          new_state: { ...state, results, pagination, meta, query: lastQuery },
        });
      }
    }
    checkForLastQuery();
  });
  const getNextPage = async () => {
    dispatch({ type: statesEnum.FETCH_STARTED });
    try {
      const nextPage = state.results.length * (state.page + 1) + 1;
      const { data: results, pagination, meta } = await search(
        lastQuery,
        state.rating,
        nextPage,
      );
      dispatch({
        type: statesEnum.FETCH_SUCCESS,
        new_state: {
          ...state,
          results,
          page: state.page + 1,
          pagination,
          meta,
        },
      });
    } catch (error) {
      dispatch({ type: statesEnum.FETCH_FAILURE });
    }
  };
  const getPreviousPage = async () => {
    dispatch({ type: statesEnum.FETCH_STARTED });
    try {
      const previousPage =
        state.results.length * state.page - state.results.length;
      const { data: results, pagination, meta } = await search(
        lastQuery,
        state.rating,
        previousPage,
      );
      dispatch({
        type: statesEnum.FETCH_SUCCESS,
        new_state: {
          ...state,
          results,
          page: state.page - 1,
          pagination,
          meta,
        },
      });
    } catch (error) {
      dispatch({ type: statesEnum.FETCH_FAILURE });
    }
  };

  return (
    <Fragment>
      <section id="input-container">
        <SearchBar
          state={state}
          dispatch={dispatch}
          inputRef={inputRef}
          setLastQuery={setLastQuery}
        />
        <RatingPicker state={state} dispatch={dispatch} lastQuery={lastQuery} />
      </section>
      <Pagination
        getNextPage={getNextPage}
        getPreviousPage={getPreviousPage}
        state={state}
      />

      <GifContainer
        state={state}
        isAuthenticated={isAuthenticated}
        user={user}
        inputRef={inputRef}
      />
      <Pagination
        getNextPage={getNextPage}
        getPreviousPage={getPreviousPage}
        state={state}
      />
    </Fragment>
  );
}

function Pagination({ getNextPage, getPreviousPage, state }) {
  const hasPreviousPage = state.pagination && state.pagination.offset !== 0;

  const hasNextPage =
    state.pagination.offset !== state.pagination.total_count && state.results;
  return (
    state.results &&
    state.results.length > 0 && (
      <section className="pagination">
        <button
          className="pagination-button"
          disabled={!hasPreviousPage}
          onClick={() => getPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="pagination-button"
          disabled={!hasNextPage}
          onClick={() => getNextPage()}
        >
          {">>"}
        </button>
      </section>
    )
  );
}

function GifContainer({ state, isAuthenticated, user, inputRef }) {
  if (state && state.results) {
    return (
      <section className="gif-container">
        {" "}
        {state.results.map(img => (
          <img
            className={"image"}
            src={isSafari() ? img.safari : img.webp}
            alt={img.title}
            key={img.id}
            id={img.id}
            onClick={async _ => {
              copyImageUrlToClipboard(img);
              await storeGifsInFirebase(isAuthenticated, user, img);
              runIfProd(() => inputRef.current.focus());
            }}
          />
        ))}
      </section>
    );
  } else {
    return null;
  }
}

function RatingPicker({ state, dispatch, lastQuery }) {
  return (
    <select
      onChange={async ({ target: { value: rating } }) => {
        dispatch({ type: statesEnum.FETCH_STARTED });
        try {
          const { data: results, pagination, meta } = await search(
            lastQuery,
            state.rating,
          );
          dispatch({
            type: statesEnum.FETCH_SUCCESS,
            new_state: { ...state, results, rating, pagination, meta },
          });
        } catch (error) {
          dispatch({ type: statesEnum.FETCH_FAILURE });
        }
      }}
    >
      <option value={"g"}>RATING: G</option>
      <option value={"pg"}>RATING: PG</option>
      <option value={"pg-13"}>RATING: PG-13</option>
      <option value={"r"}>RATING: R</option>
    </select>
  );
}

function SearchBar({ state, dispatch, inputRef, setLastQuery }) {
  return (
    <input
      id={"search"}
      value={state.query}
      placeholder={`Search for a gif`}
      ref={inputRef}
      autoFocus={true}
      onChange={({ target: { value: input } }) =>
        dispatch({ type: statesEnum.UPDATE_QUERY, query: input })
      }
      onKeyPress={async ({ key: pressedKey }) => {
        if (pressedKey === "Enter") {
          dispatch({ type: statesEnum.FETCH_STARTED });
          try {
            const { data: results, pagination, meta } = await search(
              state.query,
              state.rating,
            );
            dispatch({
              type: statesEnum.FETCH_SUCCESS,
              new_state: { ...state, results, pagination, meta },
            });
            setLastQuery(state.query);
          } catch (error) {
            dispatch({ type: statesEnum.FETCH_FAILURE });
          }
        }
      }}
    />
  );
}

async function storeGifsInFirebase(isAuthenticated, auth0User, img) {
  if (isAuthenticated) {
    //check if user exists
    let fbUser = await getGifsForUser(auth0User.email);
    if (fbUser && fbUser.gifs) {
      //update
      if (fbUser.gif_Ids.indexOf(img.id) > -1) {
        console.log("gif already in collection");
      } else {
        console.info("update");
        updateGifsForUser({
          userEmail: auth0User.email,
          gifs: [...fbUser.gifs, img],
          gif_Ids: [...fbUser.gif_Ids, img.id],
        });
      }
    } else {
      //create
      console.info("create");
      createUser({
        user: auth0User,
        gifs: [img],
        gif_Ids: [img.id],
      });
    }
  }
}

export { Home };
