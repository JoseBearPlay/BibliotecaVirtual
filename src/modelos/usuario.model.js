'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    ID: String,
    nombre: String,
    apellido: String,
    usuario: String, 
    email: String,
    rol: String,
    password: String
});

module.exports = mongoose.model('usuario', UsuarioSchema);