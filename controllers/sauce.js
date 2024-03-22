///---------------------------------------------------------------------------------///
/// Cette page sert à gérer les fonctions de controles en rapport avec les sauces   ///
///---------------------------------------------------------------------------------///

///--------------------------///
/// Déclaration du require   ///
///--------------------------///
const Sauce = require('../models/Sauces');
const fs = require('fs');

///-----------------------------------///
/// Export de la fonction getSauces   ///
///-----------------------------------///

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

///----------------------------------///
/// Export de la fonction getSauce   ///
///----------------------------------///

exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

///-----------------------------------///
/// Export de la fonction postSauce   ///
///-----------------------------------///

exports.postSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

///-------------------------------------///
/// Export de la fonction modifySauce   ///
///-------------------------------------///

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Problème authentification' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(201).json({ message: 'objet modifié !' }))
                .catch(error => res.status(401).json({ error }));
            };
        })
    .catch(error => res.status(400).json({ error }));
};

///-------------------------------------///
/// Export de la fonction deleteSauce   ///
///-------------------------------------///

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Sauce supprimé !' }))
                    .catch(error => res.status(401).json({ error }));
                });
            };
        })
    .catch( error => {res.status(500).json({ error });
    });
};

///-----------------------------------///
/// Export de la fonction likeSauce   ///
///-----------------------------------///

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
        switch (req.body.like) {
            case 1:
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: +1}, $inc: {dislikes: -1}, $push: {usersLiked: req.body.userId}, $pull: {usersDisliked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce liked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(304).json({ message: "Sauce already liked" });
                } else if (!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: 1 }, $push: {usersLiked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce liked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else {
                    res.status(404).json({ message: "Un problème est survenu lors de la modification !" });
                };
                break;

            case 0:
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce liked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce disliked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else if (!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
                    res.status(304).json({ message: "Not already Liked/disliked" });
                } else {
                    res.status(404).json({ message: "Un problème est survenu lors de la modification !" });
                };
                break;

            case -1:
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(304).json({ message: "Sauce already disliked" });
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $inc: {dislikes: +1}, $pull: {usersLiked: req.body.userId}, $push: {usersDisliked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce disliked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else if (!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: +1 }, $push: {usersDisliked: req.body.userId} })
                        .then(() => {
                            res.status(201).json({ message: 'Sauce liked !' });
                        })
                    .catch(error => res.status(401).json({ error }));
                } else {
                    res.status(404).json({ message: "Un problème est survenu lors de la modification !" });
                };
                break;
        
            default:
                res.status(400).json({ message: "Erreur dans l'opération demandé !" });
                break;
        }
        })
    .catch(error => res.status(401).json({ error }));
};