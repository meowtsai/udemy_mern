const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.from) ? data.to : "";

  if (!Validator.isLength(data.title, { min: 2, max: 40 })) {
    errors.title = "Title field need to be between 2 to 40 characters.";
  }

  if (isEmpty(data.company)) {
    errors.company = "Company filed is required.";
  }

  if (isEmpty(data.from)) {
    errors.from = "From field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
