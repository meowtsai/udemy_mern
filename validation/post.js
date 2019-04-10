const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  //console.log("post_input", data);
  data.text = !isEmpty(data.text) ? data.text : "";

  if (isEmpty(data.text)) {
    errors.text = "Text field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
