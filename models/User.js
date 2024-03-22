///------------------------------------------------------------------------------------------------------------///
/// Cette page sert à gérer le model de structure de donné pour user contenue dans la base de donnée MongoDB   ///
///------------------------------------------------------------------------------------------------------------///

///---------------------------///
/// Déclaration des require   ///
///---------------------------///

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

///--------------------------------------///
/// Structure du schema pour les users   ///
///--------------------------------------///

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

///-------------------------------------------///
/// Initialisation du plugin pour l'unicité   ///
///-------------------------------------------///

userSchema.plugin(uniqueValidator);

///-----------------------------------------------///
/// Export du model pour le controlleur de user   ///
///-----------------------------------------------///

module.exports = mongoose.model('Users', userSchema);