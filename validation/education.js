const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.schoolname = !isEmpty(data.schoolname) ? data.schoolname : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (!Validator.isLength(data.schoolname, { min: 2, max: 40 })) {
    errors.schoolname =
      "schoolname field need to be between 2 to 40 characters.";
  }

  if (isEmpty(data.from)) {
    errors.from = "From field is required.";
  }

  if (isEmpty(data.degree)) {
    errors.degree = "Degree field is required.";
  }
  if (isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Major field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
