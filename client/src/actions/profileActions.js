import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_PROFILE,
  SET_CURRENT_USER
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

//Delete account  & profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    axios
      .delete("/api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
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

export const addExperience = (experienceData, history) => dispatch => {
  axios
    .post("/api/profile/experience", experienceData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addEducation = (eduData, history) => dispatch => {
  axios
    .post("/api/profile/education", eduData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

////@route: DELETE /api/profie/eperience/:exp_id
export const deleteExperience = exp_id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    axios
      .delete(`/api/profile/experience/${exp_id}`)
      .then(res =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
export const deleteEducation = edu_id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    axios
      .delete(`/api/profile/education/${edu_id}`)
      .then(res =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
