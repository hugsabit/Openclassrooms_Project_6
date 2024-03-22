///------------------------------------------------------------------------------------------------------------///
/// Cette page sert à gérer le model de structure de donné pour user contenue dans la base de donnée MongoDB   ///
///------------------------------------------------------------------------------------------------------------///

///--------------------------///
/// Déclaration du require   ///
///--------------------------///

const mongoose = require('mongoose');

///---------------------------------------///
/// Structure du schema pour les sauces   ///
///---------------------------------------///

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [ String ] },
    usersDisliked: { type: [ String ] },
});

///------------------------------------------------///
/// Export du model pour le controlleur de sauce   ///
///------------------------------------------------///

module.exports = mongoose.model('Sauce', sauceSchema);