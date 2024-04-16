///--------------------------------------------------------------------------------///
/// Cette page sert à gérer les fonctions de controles en rapport avec les users   ///
///--------------------------------------------------------------------------------///

///--------------------------///
/// Déclaration du require   ///
///--------------------------///

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const passwordValidator = require('password-validator');

const User = require('../models/User');

///-----------------------------------------------------------------///
/// Déclaration de dotenv pour récupérer un variable dans le .env   ///
///-----------------------------------------------------------------///

dotenv.config();

///--------------------------------///
/// Export de la fonction signup   ///
///--------------------------------///

exports.signup = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(existUser => {
            if (existUser === null) {
                let schema = new passwordValidator();
                schema.is().min(8);
                schema.is().max(100);
                if (schema.validate(req.body.password)) {
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => {
                                res.status(201).json({ message: 'Utilisateur créé avec succes !' })
                            })
                        .catch(error => res.status(400).json({ error }));
                    })
                .catch(error => res.status(500).json({ error }));
                } else {
                    res.status(401).json({ message: 'Votre mot de passe doit contenir entre 8 et 100 caractères' })
                }
            } else {
                res.status(401).json({ message: 'Identifiant/Mot de passe ne peuvent être validé !' });
            };
        })
    .catch(error => res.status(500).json({ error }));
};

///-------------------------------///
/// Export de la fonction login   ///
///-------------------------------///

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Identifiant/Mot de passe incorrect' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Identifiant/Mot de passe incorrect' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.APP_SECRET,
                                    { expiresIn: '24h' }
                                )
                            });
                        };
                    })
                .catch(error => res.status(500).json({ error }))
            }
        })
    .catch(error => res.status(500).json({ error }));
};