import { combineReducers } from "redux";
import applicationReducer from "./applicationReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";

export default combineReducers({
  application: applicationReducer,
  error: errorReducer,
  auth: authReducer
});
