import axios from "axios";

import {
  ADD_POST,
  GET_ERRORS,
  POST_LOADING,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  ADD_COMMENT
} from "./types";

//@route: POST '/api/posts/'
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//get all posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: {}
      })
    );
};

//get post by its id
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: {}
      })
    );
};
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

export const deletePost = post_id => dispatch => {
  axios
    .delete(`/api/posts/${post_id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: post_id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//@route:POST '/api/posts/like/:id'
export const addLike = post_id => dispatch => {
  axios
    .post(`/api/posts/like/${post_id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//@route:POST '/api/posts/like/:id'
export const dislikePost = post_id => dispatch => {
  axios
    .post(`/api/posts/unlike/${post_id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//// @route:POST '/api/posts/comment/:id'
export const addComment = (post_id, commentData) => dispatch => {
  axios
    .post(`/api/posts/comment/${post_id}`, commentData)
    .then(res => dispatch(getPost(post_id)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//// @route:DELETE '/api/posts/comment/:id/:comment_id'

export const deleteComment = (post_id, comment_id) => dispatch => {
  axios
    .delete(`/api/posts/comment/${post_id}/${comment_id}`)
    .then(res => dispatch(getPost(post_id)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
