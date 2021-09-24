'use strict'

var express = require("express");
var libroControlador = require("../controladores/libro.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploLibro', libroControlador.ejemploLibro);
api.post('/agregarLibro', md_autorizacion.ensureAuth, libroControlador.agregarLibro);
api.get('/obtenerLibros', libroControlador.obtenerLibros);
api.get('/obtenerLibrosID/:idLibro', libroControlador.obtenerLibroID);
api.get('/ordenarCopias', libroControlador.ordenarCopias);
api.get('/ordenarDisponibles', libroControlador.ordenarDisponibles);
api.put('/editarLibro/:id', md_autorizacion.ensureAuth, libroControlador.editarLibro);
api.delete('/eliminarLibro/:id', md_autorizacion.ensureAuth, libroControlador.eliminarLibro);
api.post('/obtenerLibroNombre', libroControlador.buscarLibroNombre);
api.post('/prestarLibro', md_autorizacion.ensureAuth, libroControlador.prestarLibro);
api.delete('/devolverLibro/:id', libroControlador.devolverLibro);
api.get('/obtenerPrestamosID/:idPrestamo', libroControlador.obtenerPrestamoID);
api.get('/verPrestamos', libroControlador.verPrestamos)
module.exports = api;