const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (isEmpty(data.text)) {
    errors.email = "Text field is required.";
  }

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post field must be between 10 ~ 300 characters.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
