const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const usuario = [{
    user: "a",
    email: "a@a.com",
    password: "a"
}]

async function login(req,res) {
    console.log(req.body);
    const user = req.body.user
    const password = req.body.password
    if (!user || !password ) {
        return res.status(400).send({status:"Error", message:"Los campos estan incompletos"});
        // 400 es BAD REQUEST
    }

    const usuarioARevisar = usuario.find(usuario => usuario.user === user);
    if (!usuarioARevisar) {
        return res.status(400).send({status:"Error", message:"Error durante el login"});
    }

    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({status:"Error", message:"Error durante el login"});
    }

    const token = jsonwebtoken.sign(
        {user:usuarioARevisar.user},
         process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRATION}
    );

    // Cookie se guarda por el lado del cliente y le podemos pasar datos. Estos pueden ser la expiracion del token
    // Una vez obtenido el cookie se lo enviamos al cliente
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/" // Seleccionar y borrar
    }
    res.cookie("jwt",token,cookieOption);
    return res.send({status:"OK", message: "USUARIO LOGEADO", redirect: "/admin"});
}

async function register(req,res) {
    console.log(req.body);
    const user = req.body.user
    const email = req.body.email
    const password = req.body.password
    if (!user || !password || !email ) {
        return res.status(400).send({status:"Error", message:"Los campos estan incompletos"});
        // 400 es BAD REQUEST
    }

    const usuarioARevisar = usuario.find(usuario => usuario.user === user);
    if (usuarioARevisar) {
        return res.status(400).send({status:"Error", message:"Este usario ya existe"});
    }

    const salt= await bcryptjs.genSalt(5); // default 10 veces
    const hashPassword = await bcryptjs.hash(password,salt); 
    const nuevoUsuario = {
        user,email,password: hashPassword
    }

    console.log(usuario);
    usuario.push(nuevoUsuario);
    return res.status(201).send({status:"OK", message:`Usuario ${nuevoUsuario.user} agregado`, redirect:"/"});
    // 201 Elemento creado
    
}

module.exports = {
    login,
    register
};