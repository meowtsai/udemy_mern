import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addComment } from "../../actions/postActions";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {}
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onClick = e => {
    e.preventDefault();
    const { user } = this.props.auth;
    const { text } = this.state;
    const newComment = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: user.id
    };
    console.log(newComment);
    console.log(this.props.post.post._id);

    this.props.addComment(this.props.post.post._id, newComment);
    this.setState({ text: "" });
  };
  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <TextAreaFieldGroup
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  placeholder="Comment this post"
                  error={errors.text}
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark"
                onClick={this.onClick}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  post: state.post
});
export default connect(
  mapStateToProps,
  { addComment }
)(CommentForm);
