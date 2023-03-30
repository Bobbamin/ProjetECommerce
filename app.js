const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user');
const Categorie = require('./models/category');
const Produit = require('./models/produit');


const bdd = "mongodb://127.0.0.1:27017/ProjetECommerce";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 80000 }
  }));

mongoose
    .connect(bdd, { useNewUrlParser: true })
    .then(() => console.log("Connecté a Ma BDD"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.render("accueil");
});

app.get("/accueiluser", (req, res) => {
    let iduser = req.session.iduser;
    User.findOne({_id : iduser})
    .then((user) => {
        res.render("accueiluser",{session:req.session, user:user})
    })
    .catch((err) => console.log(err))
});


app.get("/inscription", (req, res) => {
    res.render("inscription");
});

app.post('/inscription', function (req, res) {
    const fn = req.body.firstname;
    const ln = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
        firstname: fn,
        lastname: ln,
        email: email,
        password: hash
    });


    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                newUser.save()
                    .then(() => {
                        console.log('Enregistrement réussi');
                        res.redirect('/connection');
                    })
                    .catch((err) => {
                        console.log('Enregistrement impossible', err);
                        res.send("Enregistrement de l'utilisateur impossible");
                    });
            } else {
                console.log("Email existe deja")
            }
        })
        .catch((err) => {
            console.error(err);
        })
});


app.get("/connection", (req, res) => {
    res.render("connection");
});

app.post('/connection', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                        req.session.iduser = user._id;
                    console.log("Utilisateur connecté");
                    res.redirect('/accueiluser');
                } else {
                    console.log("Mot de passe incorrect");
                }
            } else {
                console.log("L'utilisateur n'existe pas");
            }
        })
        .catch((err) => {
            console.error(err);
            console.log("Une erreur s'est produite lors de la connection");
        })
});

app.listen(3000, () => {
    console.log("Le server est demarré sur le port 3000");
});