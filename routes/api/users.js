const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//@route: GET /api/users/test
//@desc: test route
//@access: public
router.get("/test", (req, res) => {
  res.send({ msg: "Users Works!" });
});

//@route: POST /api/users/register
//@desc: register a user
//@access: public
router.post("/register", (req, res) => {
  //check if email exists
  console.log("post called");

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ email: "Email alread exists." });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });
      console.log("post called newUser", newUser);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route: POST /api/users/login
//@desc: register a user
//@access: public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user._id,
            name: user.name,
            avatar: user.avatar
          };
          const signKey = require("../../config/keys").secretOrKey;
          jwt.sign(payload, signKey, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          return res.status(400).json({ password: "Password incorrect." });
        }
      });
    }
  });
});

//@route: GET /api/users/current
//@desc: return current user
//@access: private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "success" });
  }
);

module.exports = router;
