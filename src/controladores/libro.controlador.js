'use strict'

var Libro = require("../modelos/libro.model");
var Prestamo = require("../modelos/prestarLibro");


function ejemploLibro(req, res){
    res.status(200).send({mensaje: 'Ejmplo desde el controlador de Libro'});
}

function agregarLibro(req, res){
    var libroModel = new Libro();
    var params = req.body;
    console.log(params);

    if(req.user.rol != "admin"){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede agregar libros a la aplicacion'});
    }

    if(params.autor && params.titulo){
        libroModel.autor = params.autor;
        libroModel.titulo = params.titulo;
        libroModel.edicion = params.edicion;
        libroModel.palabras_clave = [params.palabras_clave],
        libroModel.descripcion = params.descripcion;
        libroModel.temas = [params.temas],
        libroModel.copias = params.copias;
        libroModel.disponibles = params.disponibles;

        Libro.find({
            $or:[
                {titulo: libroModel.titulo}
            ]
        }).exec((err, libroEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear el libro'});

            if(libroEncontrado && libroEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'El libro ya existe en la biblioteca'});
            } else{

            libroModel.save((err, libroGuardado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion de agregar el libro al sistema'});
                if(!libroGuardado) return res.status(500).send({mensaje: 'Error al guardar los datos del libro'});

                return res.status(200).send({ libroGuardado });
            })
            }
        })  
    }
}


function obtenerLibros(req, res){

    Libro.find().exec((err, libros)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los libros'});
        if(!libros) return res.status(500).send({mensaje: 'Error al obtener los libros o no posee libros agregados en el sistema'});

        return res.status(200).send({libros});
    })
}

function obtenerLibroID(req, res){
    var libroId = req.params.idLibro;

    Libro.findById(libroId, (err, libroEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion del libro'});
        if(!libroEncontrado) return res.status(500).send({mensaje: 'Error al obtener el libro'});

        return res.status(200).send({ libroEncontrado});
    })
    
}

function ordenarCopias(req, res){

    Libro.find().sort({copias:-1}).exec((err, copias)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!copias) return res.status(500).send({mensaje: 'Error al ordenar las copias disponibles'});

        return res.status(200).send({copias});
    })
}

function ordenarDisponibles(req, res){

    Libro.find().sort({disponibles:-1}).exec((err, disponibles)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!disponibles) return res.status(500).send({mensaje: 'Error al ordenar los libros disponibles'});

        return res.status(200).send({disponibles});
    })
}

function editarLibro(req, res){
    var idLibro = req.params.id;
    var params = req.body;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede editar los libros de la biblioteca'});
    }

        Libro.findByIdAndUpdate(idLibro, params, {new: true}, (err, libroActualizado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!libroActualizado) return res.status(500).send({mensaje: 'No se a podido actualizar los datos del libro'});

            return res.status(200).send({ libroActualizado });
        })
}

function eliminarLibro(req, res){
    var idLibro = req.params.id;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede eliminar los libros de la biblioteca'});
    }

    Libro.findByIdAndDelete(idLibro,((err, libroEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar el libro de la biblioteca'});
        if(!libroEliminado) return res.status(500).send({mensaje: 'No se a podido eliminar el libro de la biblioteca'});

        return res.status(200).send({ libroEliminado });
    }))
}

function buscarLibroNombre(req, res){
    var libroNombre = req.body;

    Libro.findOne(libroNombre,(err, libroNombreEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!libroNombreEncontrado) return res.status(500).send({mensaje: 'Error al buscar el libro'});

        return res.status(200).send({libroNombreEncontrado});
    })
}

function prestarLibro(req, res){

    var prestamo = new Prestamo();

    var params = req.body;
    console.log(params);

    if(params.libro){
      prestamo.usuario = req.user.nombre;
      prestamo.libro = params.libro;
    }

    prestamo.save((err, libroPrestado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!libroPrestado) return res.status(500).send({mensaje: 'Error al prestar el libro'});

        return res.status(200).send({libroPrestado});
    })
}


function devolverLibro(req, res){
  var idPrestamo = req.params.id;

  Prestamo.findByIdAndDelete(idPrestamo,((err, libroDevuelto)=>{
      if(err) return res.status(500).send({mensaje: 'Error en la peticion de devolver el libro a la biblioteca'});
      if(!libroDevuelto) return res.status(500).send({mensaje: 'No se a podido devolver el libro'});

      return res.status(200).send({ libroDevuelto });
  }))
}

function obtenerPrestamoID(req, res){
  var prestamoId = req.params.idPrestamo;

  Prestamo.findById(prestamoId, (err, prestamoEncontrado)=>{
      if(err) return res.status(500).send({mensaje: 'Error en la peticion del prestamo'});
      if(!prestamoEncontrado) return res.status(500).send({mensaje: 'Error al obtener el prestamo'});

      return res.status(200).send({ prestamoEncontrado});
  })
  
}

function verPrestamos(req, res){

   Prestamo.find().exec((err, prestamos)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los prestamos'});
    if(!prestamos) return res.status(500).send({mensaje: 'Error al obtener los prestamos o no posee prestamos aun'});

    return res.status(200).send({prestamos});
})
}

module.exports = {
    ejemploLibro,
    agregarLibro,
    obtenerLibros,
    obtenerLibroID,
    ordenarCopias,
    ordenarDisponibles,
    editarLibro,
    eliminarLibro,
    buscarLibroNombre,
    prestarLibro,
    devolverLibro,
    obtenerPrestamoID,
    verPrestamos
}
