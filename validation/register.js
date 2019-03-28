const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be betweeb 2 and 30 characters.";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password must be betweeb 8 and 30 characters.";
  }

  if (isEmpty(data.name)) {
    errors.name = "Name is required.";
  }
  if (isEmpty(data.email)) {
    errors.email = "Email is required.";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email format is not valid.";
  }
  if (isEmpty(data.password)) {
    errors.password = "password is required.";
  }
  if (isEmpty(data.password2)) {
    errors.password2 = "Confirm password is required.";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "passowrd and confirm password should be the same.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
