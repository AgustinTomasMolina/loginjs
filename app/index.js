const express = require("express");
const path = require("path");
require('dotenv').config();
const CONFIG = require('../config/config.js');
const puerto = CONFIG.PUERTO;
const {login, register} = require("../server/controllers/auth.controller.js");

// Servidor
const app = express();
app.listen(puerto, '0.0.0.0', () => {
    console.log('Servidor corriendo en puerto:', puerto);
});

// Configuracion
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
// Rutas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "pages", "login.html"));
});
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "pages", "register.html"));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "pages/admin", "admin.html"));
});

app.post("/api/register", register);
app.post("/api/login", login);

