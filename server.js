const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config.json");
const Register = require("./models/register.js");
var bodyParser = require("body-parser");

mongoose.connect(
  config.databaseUrl,
  err => {
    if (err) throw err;
    console.log("Database connected");
  }
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/signup.html"));
});

app.post("/", (req, res, next) => {
  const newRegistration = new Register(req.body);
  newRegistration.save((err, user) => {
    if (err) throw err;
    res.redirect("/login");
  });
});

app.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.post("/login", (req, res, next) => {
  Register.findOne({ email: req.body.email }, (err, result) => {
    if (err) throw err;
    if (!result) {
      res.json({ Status: "User not exist" });
    } else if (req.body.password == result.password) {
      res.json({ Status: "Success" });
    } else {
      res.json({ Status: "Login failed" });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
