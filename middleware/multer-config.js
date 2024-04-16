///------------------------------------------------------------------------///
/// Cette page sert à gérer multer pour la gestion des fichiers d'images   ///
///------------------------------------------------------------------------///

///--------------------------///
/// Déclaration du require   ///
///--------------------------///

const multer = require('multer');

///------------------------------------///
/// Déclaration des extions d'images   ///
///------------------------------------///

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

///--------------------------------------------------///
/// Fonction de stokage et nomenclature des images   ///
///--------------------------------------------------///

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extention);
    }
});

///-----------------------------------------///
/// Export de multer pour la route sauces   ///
///-----------------------------------------///

module.exports = multer({ storage }).single('image');