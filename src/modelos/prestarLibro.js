'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prestarLibroSchema = Schema({
    usuario: {type: Schema.Types.String, ref:'usuario'},
    libro: String
});

module.exports = mongoose.model('prestamosLibro', prestarLibroSchema);