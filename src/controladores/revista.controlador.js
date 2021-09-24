'use strict'

var Revista = require("../modelos/revista.model");
var Prestamo = require("../modelos/prestarRevista");

function ejemploRevista(req, res){
    res.status(200).send({mensaje: 'Ejemplo desde el controlador de Revista'})
}

function agregarRevista(req, res){
    var revistaModel = new Revista();
    var params = req.body;
    console.log(params);

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede agregar revistar a la aplciacion'});
    }

    if(params.autor && params.titulo){
        revistaModel.autor = params.autor;
        revistaModel.titulo = params.titulo;
        revistaModel.edicion = params.edicion;
        revistaModel.descripcion = params.descripcion;
        revistaModel.frecuencia_actual = params.frecuencia_actual;
        revistaModel.ejemplares = params.ejemplares;
        revistaModel.temas = [params.temas],
        revistaModel.palabras_clave = [params.palabras_clave],
        revistaModel.copias = params.copias;
        revistaModel.disponibles = params.disponibles;

        Revista.find({
            $or:[
                {titulo: revistaModel.titulo}
            ]
        }).exec((err, revistaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});

            if(revistaEncontrada && revistaEncontrada.length >= 1){
                return res.status(500).send({mensaje: 'La revista ya existe en la biblioteca'})
            } else{
        
            revistaModel.save((err, revistaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion de agregar la revista al sistema'});
                if(!revistaGuardada) return res.status(500).send({mensaje: 'Error al guardar los datos de la revista'});

                return res.status(200).send({ revistaGuardada });
            })
            }          
        })

    }
}

function obtenerRevistas(req, res){

    Revista.find().exec((err, revistas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtner las revistas'});
        if(!revistas) return res.status(500).send({mensaje: 'Error al obtener las revistas o no posee revistas en el sistema'});

        return res.status(200).send({ revistas });
    })
}

function obtenerRevistaID(req, res){
    var revistId = req.params.idRevista;

    Revista.findById(revistId, (err, revistaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la revista'});
        if(!revistaEncontrada) return res.status(500).send({mensaje: 'Error al obtener la revista'});

        return res.status(200).send({ revistaEncontrada });
    })
}

function ordenarCopias(req, res){

    Revista.find().sort({copias:-1}).exec((err, copias)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!copias) return res.status(500).send({mensaje: 'Error al obtener las copias disponibles'});
    
        return res.status(200).send({copias});
    })
}

function ordenarDisponibles(req, res){

    Revista.find().sort({disponibles:-1}).exec((err, disponibles)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!disponibles) return res.status(500).send({mensaje: 'Error al ordenar las revistas disponibles'});

        return res.status(200).send({disponibles});
    })
}

function editarRevista(req, res){
    var idRevista = req.params.id;
    var params = req.body;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede editar las revistas de la biblioteca'});
    }

        Revista.findByIdAndUpdate(idRevista, params, {new: true}, (err, revistaActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!revistaActualizada) return res.status(500).send({mensaje: 'No se a podido actualizar los datos de la revista'});

            return res.status(200).send({ revistaActualizada });    
        })
}

function eliminarRevista(req, res){
    var idRevista = req.params.id;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede eliminar las revistas de la biblioteca'});
    }

    Revista.findByIdAndDelete(idRevista,((err, revistaEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar la revista de la biblioteca'});
        if(!revistaEliminada) return res.status(500).send({mensaje: 'No se a podido eliminar la revista de la biblioteca'});

        return res.status(200).send({ revistaEliminada });
    }))
}

function prestarRevista(req, res){

    var prestamoRevista = new Prestamo();

    var params = req.body;
    console.log(params);

    if(params.revista){
        prestamoRevista.usuario = req.user.nombre;
        prestamoRevista.revista = params.revista;
    }

    prestamoRevista.save((err, revistaPrestada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!revistaPrestada) return res.status(500).send({mensaje: 'Error al prestar la revista'});

        return res.status(200).send({revistaPrestada});
    })
}

function devolverRevista(req, res){
    var idPrestamo = req.params.id;

    Prestamo.findByIdAndDelete(idPrestamo,((err, revistaDevuelta)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de devolver la revista a la biblioteca'});
        if(!revistaDevuelta) return res.status(500).send({mensaje: 'No se a podido devolver la revista'});

        return res.status(200).send({ revistaDevuelta });
    }))
}

function obtenerPrestamoRevistaID(req, res){
    var prestamoId = req.params.idPrestamos;

    Prestamo.findById(prestamoId, (err, prestamoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la revista'});
        if(!prestamoEncontrado) return res.status(500).send({mensaje: 'Error al obtener el prestamo'});

        return res.status(200).send({prestamoEncontrado});
    })
}

function verPrestamosRevistas(req, res){
    
    Prestamo.find().exec((err, prestamos)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener las revistas'});
        if(!prestamos) return res.status(500).send({mensaje: 'Error al obtener las revistas prestadas o no ha prestado alguna revista'});

        return res.status(200).send({ prestamos });
    })
}

module.exports = {
    ejemploRevista,
    agregarRevista,
    obtenerRevistas,
    obtenerRevistaID,
    ordenarCopias,
    ordenarDisponibles,
    editarRevista,
    eliminarRevista,
    prestarRevista,
    devolverRevista,
    obtenerPrestamoRevistaID,
    verPrestamosRevistas
}