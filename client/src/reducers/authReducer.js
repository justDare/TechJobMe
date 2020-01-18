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
  CLEAR_AUTH_MSG
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  msg: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null
      };
    case USER_EDIT_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    case USER_EDIT_FAIL:
      return {
        ...state
      };
    case USER_DELETE:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case PASSWORD_RESET_SENT:
      return {
        ...state,
        msg: action.payload
      };
    case CLEAR_AUTH_MSG:
      return {
        ...state,
        msg: null
      };
    default:
      return state;
  }
}
