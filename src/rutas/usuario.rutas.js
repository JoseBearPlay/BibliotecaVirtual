'use strict'

var express = require("express");
var usuarioControlador = require("../controladores/usuario.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemplo', usuarioControlador.ejemplo);
api.get('/admin', usuarioControlador.admin);
api.post('/registrar', md_autorizacion.ensureAuth, usuarioControlador.agregarUsuario);
api.post('/login', usuarioControlador.login);
api.get('/obtenerUsuarios', md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarios);
api.get('/obtenerUsuariosID/:idUsuario', md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuarioID);
api.put('/editarUsuario/:id', md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:id', md_autorizacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.get('/ordenarAscendente', md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuariosAscendente);
api.get('/ordenarDescendente', md_autorizacion.ensureAuth, usuarioControlador.obtenerUsuariosDescendente);

module.exports = api;