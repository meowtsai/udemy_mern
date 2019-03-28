const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => {
  res.send({ msg: "Posts Works!" });
});

// @route: POST '/api/posts/'
// @desc: create a post
// @access: private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => {
      if (post) {
        res.json(post);
      }
    });
  }
);

// @route: GET '/api/posts'
// @desc: get all posts and order by date desc
// @access: public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (posts) {
        res.json(posts);
      } else {
        res.status(404).json({ errors: "No post available" });
      }
    })
    .catch(err => {
      res.status(404).json({ errors: "post not exists" });
    });
});

// @route: GET '/api/posts/:postid'
// @desc: get a post by its id
// @access: public
router.get("/:id", (req, res) => {
  const post_id = req.params.id;
  Post.findById(post_id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ errors: "post not exists" });
      }
    })
    .catch(err => {
      res.status(404).json({ errors: "post not exists" });
    });
});

// @route: DELETE '/api/posts/:postid'
// @desc: DELETE a post by its id
// @access: private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const post_id = req.params.id;
    const user_id = req.user.id;
    Profile.findOne({ user: user_id })
      .then(profile => {
        if (profile) {
          Post.findById(post_id).then(post => {
            if (post.user.toString() !== req.user.id) {
              return res.status(401).json({ errors: "not authorized" });
            } else {
              post.remove().then(post => {
                res.json({ success: true });
              });
            }
          });
        } else {
          res.status(404).json({ errors: "post not exists" });
        }
      })
      .catch(err => {
        res.status(404).json({ errors: "post not exists" + err });
      });
  }
);

// @route:POST '/api/posts/like/:id'
// @desc: Like a post
// @access: private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const post_id = req.params.id;
    const user_id = req.user.id;

    Profile.findOne({ user: user_id })
      .then(profile => {
        if (profile) {
          Post.findById(post_id).then(post => {
            if (
              post.likes.filter(like => like.user.toString() === user_id)
                .length > 0
            ) {
              return res
                .status(404)
                .json({ errors: "user already liked this post" });
            } else {
              post.likes.unshift({ user: user_id });
              post.save().then(post => res.json(post));
            }
          });
        } else {
          res.status(404).json({ errors: "post not exists" });
        }
      })
      .catch(err => {
        res.status(404).json({ errors: "post not exists" + err });
      });
  }
);
// @route:POST '/api/posts/unlike/:id'
// @desc: remove like from a post
// @access: private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(lile => like.user.toString() === req.user.id)
                .length === 0
            ) {
              return res
                .status(400)
                .json({ errors: "You haven't liked this post." });
            } else {
              const removeIndex = post.likes
                .map(like => like.user.toString())
                .indexOf(req.user.id);

              post.likes.splice(removeIndex, 1);
              post.save().then(post => {
                res.json({ success: true });
              });
            }
          })
          .catch(err => {
            return res.status(404).json({ errors: "Post not found" });
          });
      })
      .catch(err => {
        return res.status(404).json({ errors: "Profile not found" });
      });
  }
);

// @route:POST '/api/posts/comment/:id'
// @desc: Comment a post
// @access: private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const post_id = req.params.id;
    const user_id = req.user.id;

    Profile.findOne({ user: user_id })
      .then(profile => {
        if (profile) {
          Post.findById(post_id).then(post => {
            const newComment = {
              user: user_id,
              text: req.body.text,
              name: req.body.name,
              avatar: req.body.avatar
            };
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));
          });
        } else {
          res.status(404).json({ errors: "post not exists" });
        }
      })
      .catch(err => {
        res.status(404).json({ errors: "post not exists" + err });
      });
  }
);

// @route:DELETE '/api/posts/comment/:id/:comment_id'
// @desc: DELETE a comment
// @access: private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const post_id = req.params.id;
    const comment_id = req.params.comment_id;
    const user_id = req.user.id;

    Profile.findOne({ user: user_id })
      .then(profile => {
        if (profile) {
          Post.findById(post_id)
            .then(post => {
              if (
                post.comments.filter(comment => comment.id === comment_id)
                  .length > 0
              ) {
                const removeIndex = post.comments
                  .map(comment => comment.id)
                  .indexOf(comment_id);
                post.comments.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
              } else {
                return res.status(404).json({ errors: "comment not exists" });
              }
            })
            .catch(err => {
              return res.status(404).json({ errors: "post not exists" });
            });
        } else {
          res.status(404).json({ errors: "post not exists" });
        }
      })
      .catch(err => {
        res.status(404).json({ errors: "post not exists" + err });
      });
  }
);
module.exports = router;
