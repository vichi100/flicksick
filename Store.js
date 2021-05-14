import { createStore, combineReducers } from "redux";
import AppReducer from "./src/reducers/AppReducer";
const rootReducer = combineReducers({ AppReducer });
const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
