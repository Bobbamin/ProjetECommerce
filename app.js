const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const app = express();
const ejs = require('ejs');
var bodyParser = require('body-parser')
const User = require('./models/user');


const bdd = "mongodb://127.0.0.1:27017/ProjetECommerce";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(bdd, { useNewUrlParser: true })
  .then(() => console.log("Connecté a Ma BDD"))
  .catch((err) => console.log(err));


app.get("/inscription", (req, res) => {
  res.render("inscription");
});

app.post('/inscription', function(req, res) {
  const fn = req.body.firstname;
  const ln = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({
    firstname: fn,
    lastname: ln,
    email: email,
    password: password
  });

  newUser.save()
    .then(() => {
      console.log('Enregistremennt réussi');
      res.redirect('/connection');
    })
    .catch((err) => {
      console.log('Enregistrement impossible', err);
      res.send("Enregistrement de l'utilisateur impossible");
    });
});

app.get("/connection", (req, res) => {
  res.render("connection");
});

app.listen(3000, () => {
  console.log("Le server est demarré sur le port 3000");
});
