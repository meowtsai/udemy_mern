const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send({ msg: "Users Works!" });
});

router.get("/", function(req, res) {
  res.send("Birds home page");
});

module.exports = router;
