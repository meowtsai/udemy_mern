import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { deletePost, addLike, dislikePost } from "../../actions/postActions";
import classnames from "classnames";
class PostItem extends Component {
  onDeleteClick(post_id) {
    //console.log("delete click");
    this.props.deletePost(post_id);
  }
  onLikeClick(post_id) {
    this.props.addLike(post_id);
  }
  onDislikeClick(post_id) {
    this.props.dislikePost(post_id);
  }

  render() {
    const { post, auth, showActions } = this.props;

    const likeCount = post.likes.length;
    const postLiked =
      post.likes.filter(like => like.user === auth.user.id).length > 0
        ? true
        : false;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <div>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={this.onLikeClick.bind(this, post._id)}
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": postLiked
                    })}
                  />
                  <span className="badge badge-light">{likeCount}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={this.onDislikeClick.bind(this, post._id)}
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {auth.user.id === post.user && (
                  <button
                    type="button"
                    className="btn btn-danger mr-1"
                    onClick={this.onDeleteClick.bind(this, post._id)}
                  >
                    <i className="fas fa-times" />
                  </button>
                )}{" "}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};
PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, dislikePost }
)(PostItem);
