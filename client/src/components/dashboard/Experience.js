import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteClick = exp_id => {
    console.log(exp_id);
    this.props.deleteExperience(exp_id);
  };
  render() {
    console.log("experience", this.props);
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.title}</td>
        <td>{exp.position}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>-{" "}
          {exp.to === null ? (
            "Now"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this, exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-2">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};
export default connect(
  null,
  { deleteExperience }
)(Experience);
