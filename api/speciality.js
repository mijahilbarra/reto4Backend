'use strict'

//REQUERIMIENTOS

	var express = require('express');
	var router = express.Router();

	//Requerimiento de modelo speciality
	var Speciality = require('../models/speciality');
	//Requerimiento de modelo user
	var User = require('../models/user');  
	//Requerimiento de middleware access
	var Access = require('../middlewares/access');   

//OPERACIONES

	// READ

		// Operacion Read a toda la coleccion
		router.route('/specialities')
			.get(function(req,res){
				// Obtener toda la coleccion specialities
				Speciality.find()
				.then( function(especialidades) {
					// Servir coleccion  
					res.json(especialidades);
				})
			});

		// Operacion Read a un registro en particular
		router.route('/specialities/:nombre')
			.get(function(req,res){
				// Obtencion de parametros de url
				var nombre = req.params.nombre;
				// Busqueda de resgitro particular
				Speciality.findOne({nombre:nombre})
				.then( function(especialidad) {
					// Servir registro
					res.json(especialidad);  
				})
			});

	// CREATE

		// Operacion Create en la coleccion
		router.route('/specialities')
			.post(function(req,res){
				console.log(req.body);
				// Obtencion de variables del body
				var nombre = req.body.nombre;
				var imagen = req.body.imagen;
				// Creacion de un nuevo registro de especialidad
				var especialidad = new Speciality({ 
					nombre: nombre, 
					imagen: imagen 
				})
				// Almacenamiento del registro en la base de datos
				especialidad.save(function(err) {
					if (err) {
						// Si hay un error al momento de guardar el registro 
						//nos muestra succes:false y cual fue el error 
						console.log(err);
						res.json({success:false,error:err});
					} else {
						// Si el registro se completo sin errores 
						// nos devuelve succes:true y el registro creado
						res.json({success:true,especialidad:especialidad});
					}
				})
			});

	// UPDATE

		// Operacion Update de un registro en particular
		router.route('/specialities/:nombre')
			.put(Access, function(req,res){
				// Obtencion de parametros de url
				var nombre = req.params.nombre;
				// Obtencion de variables del body
				var new_nombre = req.body.nombre;
				var new_imagen = req.body.imagen;
				// Busqueda del registro por su nombre unico
				Speciality.findOne({nombre:nombre})
				.then( function(especialidad) {
					// Si hay actualizacion en el nombre
					if(new_nombre) {
						// Remmplazamos el anterior varlor por el nuevo
						especialidad.nombre = new_nombre;
					} 
					// Si hay actualizacion en la imagen 
					if(new_imagen) {
						// Remmplazamos el anterior varlor por el nuevo
						especialidad.imagen = new_imagen;
					}
					// Almacenamiento del registro en la base de datos
					especialidad.save(function(err){
						if(err) {
							// Si hay un error al momento de guardar el registro 
							//nos muestra succes:false y cual fue el error 
							console.log(err);
							res.json({success:false,error:err});
						}else{
							// Si el registro se completo sin errores 
							// nos devuelve succes:true y el registro creado
							res.json({success:true,especialidad:especialidad})
						}	
					})
				})
			});

	// DELETE

		// Operacion Update de un registro en particular
		router.route('/specialities/:nombre')
			.delete(Access, function(req,res){
				// Obtencion de parametros de url
				var nombre = req.params.nombre;
				// Busqueda del registro por su nombre unico
				Speciality.findOne({nombre:nombre})
				.then( function(especialidad) {
					// Eliminacion del registro
					especialidad.remove(function(err){
						if(err) {
							// Si hay un error al momento de guardar el registro 
							//nos muestra succes:false y cual fue el error 
							console.log(err);
							res.json({success:false,error:err});
						}else{
							// Si el registro se completo sin errores 
							// nos devuelve succes:true
							res.json({success:true})
						}	
					})
				})
			});
//EXPORTACION
	module.exports = router;