const express = require("express");
const mongoose = require("mongoose");

const app = express();
const db = require("./config/keys").MongoURI;

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => console.log("DB connect Failed"));

app.get("/", (req, res) => {
  res.send("Hello Worlsssd!");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
