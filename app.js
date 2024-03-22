///---------------------------------------------------------------------------------------///
/// Cette page sert à gérer les routes pricipales du serveurs et sa connexion a MangoDB   ///
///---------------------------------------------------------------------------------------///

///---------------------------///
/// Déclaration des require   ///
///---------------------------///

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require("dotenv");

const user = require('./routes/user');
const sauces = require('./routes/sauces');

///-----------------------------------------------------------------///
/// Déclaration de dotenv pour récupérer un variable dans le .env   ///
///-----------------------------------------------------------------///

dotenv.config();

///------------------------///
/// Déclaration de l'app   ///
///------------------------///

const app = express();

///-----------------------///
/// Connexion à MangoDB   ///
///-----------------------///

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

///-------------------------------------------------///
/// Déclaration des entêtes des requêtes reponses   ///
///-------------------------------------------------///

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

///--------------------------------------------///
/// Déclaration des routes pour les requêtes   ///
///--------------------------------------------///

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', user);

app.use('/api/sauces', sauces);

///-----------------------------------///
/// Export de l'app pour le serveur   ///
///-----------------------------------///

module.exports = app;