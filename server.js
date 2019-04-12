const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const db = require("./config/keys").MongoURI;
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => console.log("DB connect Failed"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set a static folder
  app.use(express.static("client/build"));
  //set a route for anything else not list above
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
