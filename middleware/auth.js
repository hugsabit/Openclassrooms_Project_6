///-----------------------------------------------------------------------------///
/// Cette page sert à gérer l'autentification à l'aide de token gérés par JWT   ///
///-----------------------------------------------------------------------------///

///--------------------------///
/// Déclaration du require   ///
///--------------------------///

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

///-----------------------------------------------------------------///
/// Déclaration de dotenv pour récupérer un variable dans le .env   ///
///-----------------------------------------------------------------///

dotenv.config();

///--------------------------------///
/// Export du try/catch du token   ///
///--------------------------------///

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.APP_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    };
};