import axios from 'axios';
import { returnErrors } from './errorActions';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_EDIT_SUCCESS,
  USER_EDIT_FAIL,
  USER_DELETE,
  PASSWORD_RESET_SENT,
  CLEAR_AUTH_MSG,
  RESET_TOKEN_OK,
  RESET_TOKEN_ERROR,
  PASSWORD_UPDATED_VIA_EMAIL
} from './types';
import { deleteAllApplications } from '../actions/applicationActions';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

// Register User
export const register = ({
  name,
  email,
  password,
  passwordCheck
}) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, password, passwordCheck });

  axios
    .post('/api/users', body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

// Login user
export const login = ({ email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post('/api/auth', body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

export const editUser = fields => (dispatch, getState) => {
  // Request body
  const body = JSON.stringify(fields);

  axios
    .post('/api/users/edit', body, tokenConfig(getState))
    .then(response =>
      dispatch({
        type: USER_EDIT_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'USER_EDIT_FAIL')
      );
      dispatch({
        type: USER_EDIT_FAIL
      });
    });
};

export const deleteUser = _id => (dispatch, getState) => {
  axios
    .delete(`/api/users/delete/${_id}`, tokenConfig(getState))
    .then(() => {
      dispatch({
        type: USER_DELETE
      });
      deleteAllApplications(_id);
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'USER_EDIT_FAIL')
      );
    });
};

export const validatePasswordResetToken = token => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  axios
    .get(`/api/auth/check-reset-token/${token}`, config)
    .then(response => {
      dispatch({ type: RESET_TOKEN_OK, payload: response.data });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({ type: RESET_TOKEN_ERROR, payload: err.response.data });
    });
};

export const forgotPasswordEmail = email => (dispatch, getState) => {
  // Request body
  const body = JSON.stringify(email);

  console.log(body);

  axios
    .post('api/auth/forgot-password', body, tokenConfig(getState))
    .then(response => {
      dispatch({ type: PASSWORD_RESET_SENT, payload: response.data });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'EMAIL_NOT_IN_DB')
      );
    });
};

export const updatePasswordViaEmail = ({
  _id,
  token,
  password
}) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ _id, token, password });

  console.log('body ' + body);

  axios
    .post('/api/auth/update-password-via-email', body, config)
    .then(response => {
      dispatch({ type: PASSWORD_UPDATED_VIA_EMAIL, payload: response.data });
    })
    .catch(err => {
      console.log(err);
    });
};

// Setup config/headers and token
export const tokenConfig = getState => {
  // Get token from local storage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

// CLEAR ERRORS
export const clearAuthMessage = () => {
  return {
    type: CLEAR_AUTH_MSG
  };
};
