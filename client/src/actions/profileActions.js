import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_PROFILE,
  CREATE_PROFILE
} from "./types";

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfoleLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setProfoleLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearProfole = () => {
  return {
    type: CLEAR_PROFILE
  };
};
