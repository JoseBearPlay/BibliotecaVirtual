'use strict'

var express = require("express");
var revistaControlador = require("../controladores/revista.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploRevista', revistaControlador.ejemploRevista);
api.post('/agregarRevista', md_autorizacion.ensureAuth, revistaControlador.agregarRevista);
api.get('/obtenerRevistas', revistaControlador.obtenerRevistas);
api.get('/obtenerRevistasID/:idRevista', revistaControlador.obtenerRevistaID);
api.get('/ordenarCopiasRevista', revistaControlador.ordenarCopias);
api.get('/ordenarDisponiblesRevista', revistaControlador.ordenarDisponibles)
api.put('/editarRevista/:id', md_autorizacion.ensureAuth, revistaControlador.editarRevista);
api.delete('/eliminarRevista/:id', md_autorizacion.ensureAuth, revistaControlador.eliminarRevista);
api.post('/prestarRevista', md_autorizacion.ensureAuth, revistaControlador.prestarRevista);
api.delete('/devolverRevista/:id', revistaControlador.devolverRevista);
api.get('/obtenerPrestamoRevistaID/:idPrestamos', revistaControlador.obtenerPrestamoRevistaID);
api.get('/verPrestamosRevista', revistaControlador.verPrestamosRevistas);

module.exports = api;