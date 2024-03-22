///-----------------------------------------------------------///
/// Cette page sert à gérer les routes venants de /api/auth   ///
///-----------------------------------------------------------///

///---------------------------///
/// Déclaration des require   ///
///---------------------------///

const express = require('express');
const usersCtrl = require('../controllers/user');

///-------------------------///
/// Déclaration de router   ///
///-------------------------///

const router = express.Router();

///-----------------------------------------------///
/// Déclaration des fonctions reliés aux routes   ///
///-----------------------------------------------///

router.post('/signup', usersCtrl.signup);

router.post('/login', usersCtrl.login);

///-------------------------------///
/// Export de router pour l'app   ///
///-------------------------------///

module.exports = router;