import axios from 'axios';
import {
  GET_APPLICATIONS,
  ADD_APPLICATION,
  DELETE_APPLICATION,
  APPLICATIONS_LOADING
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getApplications = () => dispatch => {
  dispatch(setApplicationsLoading());
  axios
    .get('/api/applications')
    .then(res =>
      dispatch({
        type: GET_APPLICATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
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

export const addApplication = application => (dispatch, getState) => {
  axios
    .post('/api/applications', application, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_APPLICATION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setApplicationsLoading = () => {
  return {
    type: APPLICATIONS_LOADING
  };
};
