'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'proyecto_practica_2019070';

exports.createToken = function (usuario) {
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        username: usuario.usuario,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}