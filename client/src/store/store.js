import { createStore, applyMiddleware } from "redux";
// import axiosMiddleware from "redux-axios-middleware";
import thunk from "redux-thunk";
// import axios from "axios";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./reducers";

const initialState = {};
const middleware = [thunk];

const store = createStore(
  allReducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
