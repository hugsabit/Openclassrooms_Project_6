///--------------------------------------------------------------------///
/// Cette page sert à créer le serveur et son port de fonctionnement   ///
///--------------------------------------------------------------------///

///---------------------------///
/// Déclaration des require   ///
///---------------------------///

const http = require('http');
const app = require('./app');
const dotenv = require("dotenv");

///-----------------------------------------------------------------///
/// Déclaration de dotenv pour récupérer un variable dans le .env   ///
///-----------------------------------------------------------------///

dotenv.config();

///-------------------------------------///
/// Fonction de normalisation du port   ///
///-------------------------------------///

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

///----------------------------------///
/// Choix du port et mise en place   ///
///----------------------------------///

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

///-----------------------------------------------------------///
/// Fonction de gestion des erreurs du lancement du serveur   ///
///-----------------------------------------------------------///

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

///--------------------------///
/// Déclaration du serveur   ///
///--------------------------///

const server = http.createServer(app);

///-------------------------------------------------------------------///
/// Lancement du serveur avec gestion des erreurs et le port choisi   ///
///-------------------------------------------------------------------///

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
server.listen(port);