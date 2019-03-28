const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//@route: GET /api/profile/test
//@desc: test route
//@access: public
router.get("/test", (req, res) => {
  res.send({ msg: "Profile Works!" });
});

//@route: GET /api/profie
//@desc: get current user
//@access: private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        console.log("profile", profile);
        if (!profile) {
          errors.noprofile = "User profile not found.";
          return res.status(400).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
);

//@route: POST /api/profie
//@desc: create user profile
//@access: private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (req.body.experience) profileFields.experience = req.body.experience;
    if (req.body.education) profileFields.education = req.body.education;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update

        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => {
          console.log("findOneAndUpdate", profile);
          res.json(profile);
        });
      } else {
        //create
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            json.stauts(400).json({ errors: "that handle already exists" });
          } else {
            new Profile(profileFields).save().then(profile => {
              res.json(profile);
            });
          }
        });
      }
    });
    //res.json({ msg: "post received!" });
  }
);

//@route: GET /api/profie/handle/:handle
//@desc: get a profile by handle
//@access: public

router.get("/handle/:handle", (req, res) => {
  const handle = req.params.handle;
  Profile.findOne({ handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (profile) {
        return res.json(profile);
      } else {
        let errors = { noprofie: "profile not found!" };
        return res.status(404).json(errors);
      }
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

//@route: GET /api/profie/user/:user_id
//@desc: get a profile by user id
//@access: public

router.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  Profile.findOne({ user: user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (profile) {
        return res.json(profile);
      } else {
        let errors = { noprofie: "profile not found!" };
        return res.status(404).json(errors);
      }
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

//@route: GET /api/profie/all
//@desc: get all profiles
//@access: public

router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (profile) {
        return res.json(profile);
      } else {
        let errors = { noprofie: "profile not found!" };
        return res.status(404).json(errors);
      }
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        console.log("profile", profile);
        if (!profile) {
          errors.noprofile = "User profile not found.";
          return res.status(400).json(errors);
        }
        return res.json(profile);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
);

//@route: PoST /api/profie/experience
//@desc: add experience to a profile
//@access: private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        profile.experience.unshift(newExp);
        profile.save().then(res.json(profile));
      } else {
        return res.status(404).json({ noprofile: "Profile not found" });
      }
    });
  }
);

//@route: PoST /api/profie/education
//@desc: add education to a profile
//@access: private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const newEdu = {
          schoolname: req.body.schoolname,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        profile.education.unshift(newEdu);
        profile.save().then(res.json(profile));
      } else {
        return res.status(404).json({ noprofile: "Profile not found" });
      }
    });
  }
);

//@route: DELETE /api/profie/eperience/:exp_id
//@desc: delete an experience by id
//@access: private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const exp_id = req.params.exp_id;
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(exp_id);
          profile.experience.splice(removeIndex, 1);
          profile.save().then(res.json(profile));
        } else {
          return res.status(404).json({ noprofile: "Profile not found" });
        }
      })
      .catch(err => res.status(404).json({ error: err }));
  }
);

//@route: DELETE /api/profie/education/:edu_id
//@desc: delete an education by id
//@access: private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const edu_id = req.params.edu_id;
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(edu_id);
          profile.education.splice(removeIndex, 1);
          profile.save().then(res.json(profile));
        } else {
          return res.status(404).json({ noprofile: "Profile not found" });
        }
      })
      .catch(err => res.status(404).json({ error: err }));
  }
);

//@route: DELETE /api/profie
//@desc: delete profile
//@access: private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(profile => {
        User.findByIdAndRemove({ _id: req.user.id }).then(() => {
          res.json({ success: true });
        });
      })
      .catch(err => res.status(404).json({ error: err }));
  }
);
module.exports = router;
