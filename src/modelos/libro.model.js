'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BibliotecaSchema = Schema({
    autor: String,
    titulo: String,
    edicion: String,
    descripcion: String,
    palabras_clave: [String],
    temas: [String],
    copias: Number,
    disponibles: Number
});

module.exports = mongoose.model('libro', BibliotecaSchema);