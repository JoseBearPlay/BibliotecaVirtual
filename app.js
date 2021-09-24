'use strict'

//Variable Globales
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

//Importacion de rutas
var usuario_rutas = require("./src/rutas/usuario.rutas");
var libro_rutas = require("./src/rutas/libro.rutas");
var revista_rutas = require("./src/rutas/revista.rutas");

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Aplicacio de rutas
app.use('/api', usuario_rutas, libro_rutas, revista_rutas);

//Exportar
module.exports = app;