const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle need to be between 2 to 40 characters.";
  }
  if (isEmpty(data.handle)) {
    errors.handle = "Profile handle is required.";
  }

  if (isEmpty(data.status)) {
    errors.status = "Status field is required.";
  }
  if (isEmpty(data.skills)) {
    errors.skills = "skills field is required.";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Website field should be in URL format.";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "facebook field should be in URL format.";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "youtube field should be in URL format.";
    }
  }

  if (!isEmpty(data.twitter)) {
    console.log("twitter", data.twitter);
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "twitter field should be in URL format.";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "linkedin field should be in URL format.";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "instagram field should be in URL format.";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
