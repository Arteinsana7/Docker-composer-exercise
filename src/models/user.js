//Role, de ls user.js est de definir le schema de donnees pour les utilisateurs
// creer un midleware d'authentification avec : bcrypt jwt avec sign  process.env.JWT_EXPIRES_IN

//methode compare password Promisefy=  methode js qui permets d etransformer touts les fonction qui auront un call back en mehtode qui retourne une promesse
/* 
const promisifyVeryy = promisify(jwt.verify);
const decoded = await promisifyVeryy(token, process.env.JWT_SECRET);

Middelware a placer avant chacun de routes qui ont besoin d'tre protegé.


*/
