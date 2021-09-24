'use strict'

var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function ejemplo(req, res){
    res.status(200).send({mensaje: 'El usuario se creo correctamente'});
}

function admin(req, res){
    var usuarioModel = new Usuario();
   
    usuarioModel.usuario = 'adminpractica';
    usuarioModel.password = 'adminpractica';
    usuarioModel.rol = 'admin';

    Usuario.findOne({usuario: usuarioModel.usuario}, (err, administradorIdentificado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(administradorIdentificado){
            return console.log('Error el usuario admin ya existe');
        }else{
            bcrypt.hash(usuarioModel.password, null, null, (err, passwordEncriptada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                
                if(passwordEncriptada){
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.usuario = usuarioModel.usuario;
                    usuarioModel.rol = 'admin'

                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear al administrador'});
                        if(usuarioGuardado){
                            return console.log('Se han guardado los datos del administrador correctamente');
                        }else{
                            return res.status(500).send({mensaje: 'No se a podido crear al usuario admin dentro del sistema'});
                        }
                    })
                } else{
                    return res.status(500).send({mensaje: 'No se han podido decoficar los datos de la contraseña'});
                }
            })
        }
    })

}

function agregarUsuario(req, res){
    var usuarioModel = new Usuario();
    var params = req.body;
    console.log(params);

    if(req.user.rol != "admin"){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede agregar usuarios a la aplicacion'});
    }

    if(params.email && params.usuario && params.password){
        usuarioModel.ID = params.ID;
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = params.rol;
        usuarioModel.password = params.password;

        

        Usuario.find({
            $or: [
                { ID: usuarioModel.ID},
                { usuario: usuarioModel.usuario}
            ]
        }).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de crear el Usuario'});
        
            if(usuarioEncontrado && usuarioEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'El ID ingresado ya le pertenece a otro usuario dentro del sistema'});
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion de guardar el usuario'})

                        if(usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado })
                        } else {
                            res.status(404).send({mensaje: 'No se ha podido registrar al usuario'});
                        }
                    })
                })
            }
        })
    }
}


function login(req, res) {
    var params = req.body;
   
    if(params.usuario || params.email){
        if(params.password){
    Usuario.findOne({$or:[{usuario: params.usuario}, {email: params.email}]}, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'El usuario no se a podido identificar' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
        }
    })
    }
    }
}



function obtenerUsuarios (req, res){

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede ver los usuarios de la aplicacion'});
    }

    Usuario.find().exec((err, usuarios)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los usuarios'});
        if(!usuarios) return res.status(500).send({mensaje: 'Error al obtener los usuarios o no posee usuarios registrados en el sistema'});

        return res.status(200).send({usuarios});
    })
}

function obtenerUsuariosAscendente (req, res){

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede ver los usuarios de la aplicacion'});
    }

    Usuario.find().sort({ID:1}).exec((err, usuarios)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los usuarios'});
        if(!usuarios) return res.status(500).send({mensaje: 'Error al obtener los usuarios o no posee usuarios registrados en el sistema'});

        return res.status(200).send({usuarios});
    })
}

function obtenerUsuariosDescendente (req, res){

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede ver los usuarios de la aplicacion'});
    }

    Usuario.find().sort({ID:-1}).exec((err, usuarios)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener los usuarios'});
        if(!usuarios) return res.status(500).send({mensaje: 'Error al obtener los usuarios o no posee usuarios registrados en el sistema'});

        return res.status(200).send({usuarios});
    })
}

function obtenerUsuarioID(req, res){
    var usuarioId = req.params.idUsuario;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede ver usuarios'});
    }

    Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion de usuario'});
        if(!usuarioEncontrado) return res.status(500).send({mensaje: 'Error al obtener el usuario'});

        return res.status(200).send({ usuarioEncontrado });
    })
}

function editarUsuario(req, res){
    var idUsuario = req.params.id;
    var params = req.body;

    delete params.password;

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede editar a los usuarios'});
    }
    
    Usuario.findByIdAndUpdate(idUsuario, params, {new: true}, (err, usuarioActualizado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!usuarioActualizado) return res.status(500).send({mensaje: 'No se a podido actualizar los datos del usuario'});

        return res.status(200).send({ usuarioActualizado });
    })
}

function eliminarUsuario (req, res){
    var idUsuario = req.params.id

    if(req.user.rol != 'admin'){
        return res.status(500).send({mensaje: 'Solo el rol tipo admin puede eliminar usuarios'});
    }

    Usuario.findByIdAndDelete(idUsuario, ((err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de eliminar al usuario'});
        if(!usuarioEliminado) return res.status(500).send({mensaje: 'No se a podido eliminar al usuario'});

        return res.status(200).send({ usuarioEliminado });
    }))
}

module.exports = {
    ejemplo,
    admin, 
    agregarUsuario,
    login,
    obtenerUsuarios,
    obtenerUsuarioID,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuariosAscendente,
    obtenerUsuariosDescendente
}
