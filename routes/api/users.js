const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

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
  //console.log("post called");
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email alread exists.";
      res.status(400).json(errors);
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
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.email = "User not found.";
      return res.status(404).json(errors);
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
          errors.password = "Password incorrect.";
          return res.status(400).json(errors);
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
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// {
//   "_id": "5c94a8987db9541a809b2acf",
//   "name": "Sophie Tsai",
//   "email": "shihfan.tsai@gmail.com",
//   "password": "$2a$10$W3xWZGlM7ECNTzoywWcIsuVAdzhBUoz6vX6x2vNqNaWwSnaRx2jwK",
//   "avatar": "//www.gravatar.com/avatar/6ed9f619420cff24b285a24d8480d8b6?s=200&r=pg&d=mm",
//   "date": "2019-03-22T09:19:20.848Z",
//   "__v": 0
// }
module.exports = router;
