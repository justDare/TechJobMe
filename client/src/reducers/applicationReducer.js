import {
  GET_APPLICATIONS,
  CLEAR_APPLICATIONS,
  ADD_APPLICATION,
  ADD_APPLICATION_FAIL,
  DELETE_APPLICATION,
  DELETE_ALL,
  APPLICATIONS_LOADING,
  EDIT_APPLICATION
} from '../actions/types';

const initialState = {
  applications: [],
  loading: false,
  msg: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
        loading: false
      };
    case ADD_APPLICATION_FAIL:
      return {
        ...state
      };
    case CLEAR_APPLICATIONS:
      return {
        ...state,
        applications: [],
        loading: false
      };
    case DELETE_APPLICATION:
      return {
        ...state,
        applications: state.applications.filter(
          application => application._id !== action.payload
        )
      };
    case DELETE_ALL:
      return {
        ...state,
        applications: [],
        msg: 'All applications deleted successfully!'
      };
    case ADD_APPLICATION:
      return {
        ...state,
        applications: [action.payload, ...state.applications],
        msg: 'Application added successfully!'
      };
    case APPLICATIONS_LOADING:
      return {
        ...state,
        loading: true
      };
    case EDIT_APPLICATION:
      return {
        ...state,
        applications: state.applications.map(application =>
          application._id === action.payload._id
            ? // updated application
              action.payload
            : // otherwise return original
              application
        )
      };

    default:
      return state;
  }
}
