import axios from "axios";
import {
  GET_APPLICATIONS,
  ADD_APPLICATION,
  ADD_APPLICATION_FAIL,
  DELETE_APPLICATION,
  APPLICATIONS_LOADING,
  CLEAR_APPLICATIONS,
  EDIT_APPLICATION
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

export const getApplications = id => (dispatch, getState) => {
  dispatch(setApplicationsLoading());
  axios
    .get(`/api/applications/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_APPLICATIONS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const deleteApplication = id => (dispatch, getState) => {
  axios
    .delete(`/api/applications/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_APPLICATION,
        payload: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addApplication = applicationInfo => (dispatch, getState) => {
  // Request body
  const body = JSON.stringify(applicationInfo);

  axios
    .post("/api/applications", body, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_APPLICATION,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADD_APPLICATION_FAIL"
        )
      );
      dispatch({ type: ADD_APPLICATION_FAIL });
    });
};

export const editApplication = application => (dispatch, getState) => {
  axios
    .post("/api/applications/edit", application, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: EDIT_APPLICATION,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const setApplicationsLoading = () => {
  return {
    type: APPLICATIONS_LOADING
  };
};

export const clearApplications = () => {
  return {
    type: CLEAR_APPLICATIONS
  };
};
