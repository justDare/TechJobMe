import axios from "axios";
import {
  GET_APPLICATIONS,
  ADD_APPLICATION,
  DELETE_APPLICATION,
  APPLICATIONS_LOADING
} from "./types";

export const getApplications = () => dispatch => {
  dispatch(setApplicationsLoading());
  axios.get("/api/applications").then(res =>
    dispatch({
      type: GET_APPLICATIONS,
      payload: res.data
    })
  );
};

export const deleteApplication = id => dispatch => {
  axios.delete(`/api/applications/${id}`).then(res =>
    dispatch({
      type: DELETE_APPLICATION,
      payload: id
    })
  );
};

export const addApplication = application => dispatch => {
  axios.post("/api/applications", application).then(res =>
    dispatch({
      type: ADD_APPLICATION,
      payload: res.data
    })
  );
};

export const setApplicationsLoading = () => {
  return {
    type: APPLICATIONS_LOADING
  };
};
