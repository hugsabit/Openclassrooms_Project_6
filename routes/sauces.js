///-------------------------------------------------------------///
/// Cette page sert à gérer les routes venants de /api/sauces   ///
///-------------------------------------------------------------///

///---------------------------///
/// Déclaration des require   ///
///---------------------------///

const express = require('express');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauce');

///-------------------------///
/// Déclaration de router   ///
///-------------------------///

const router = express.Router();

///-----------------------------------------------///
/// Déclaration des fonctions reliés aux routes   ///
///-----------------------------------------------///

router.get('/', auth, saucesCtrl.getSauces);

router.get('/:id', auth, saucesCtrl.getSauce);

router.post('/', auth, multer, saucesCtrl.postSauce);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, saucesCtrl.deleteSauce);

router.post('/:id/like', auth, saucesCtrl.likeSauce);

///-------------------------------///
/// Export de router pour l'app   ///
///-------------------------------///

module.exports = router;