'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var prestarRevistaSchema = Schema({
    usuario: {type: Schema.Types.String, ref:'usuario'},
    revista: String
});

module.exports = mongoose.model('prestamosRevista', prestarRevistaSchema);