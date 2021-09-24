'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RevistaSchema = Schema({
    autor: String,
    titulo: String,
    edicion: String,
    descripcion: String,
    frecuencia_actual: String,
    ejemplares: Number,
    temas: [String],
    palabras_clave: [String],
    copias: Number,
    disponibles: Number
});

module.exports = mongoose.model('revista', RevistaSchema);