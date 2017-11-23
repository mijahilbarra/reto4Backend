'use strict'

// REQUERIMIENTO DE MODULOS

	var express = require('express');
	var router = express.Router();
	var bcrypt = require('bcryptjs');
	
	// Requerimiento de modelo speciality
	var Speciality = require('../models/speciality'); 

	//Requerimiento de modelo user
	var User = require('../models/user');

// PETICIONES
	// Cuando exista una petición en el servidor  
	router.route('/')
		.get(function(req,res){
		// Consulta al modelo Speciality en la base de datos.
		Speciality.find()
		.then( function(especialidades) {
			res.render('especialidades.html', {  categorias:especialidades  });
		})
	});

	// Creacion de una instancia mediante valores en url
	router.route('/agregar/:nombre/:imagen/')
		.get(function(req,res){
		//Obtencion de parametros de url
		var nombre = req.params.nombre;
		var imagen = req.params.imagen;
		//Crear una instancia del modelo speciality
		var speciality = new Speciality({ nombre: nombre, imagen: imagen })
		//Guardar instancia del modelo
		speciality.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				// Redireccion a home
				res.redirect('/');
			}
		}); 

	});

	// Creacion de una instancia mediante consulta en url
	router.route('/query/')
		.get(function(req,res){
		//Obtencion de consultas de la url
		var nombre = req.query.nombre;
		var imagen = req.query.imagen;
		// Creacion de una instancia mediante valores en url
		var speciality = new Speciality({ nombre: nombre, imagen: imagen })
		//Guardar instancia del modelo
		speciality.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				// Redireccion a home
				res.redirect('/');
			}
		});	
	});

	// Petición get del formulario
	router.route('/formulario/')
		.get(function(req,res){
			Speciality.find()
				.then( function(especialidades) {
					res.render('formulario.html', {  categorias:especialidades  });
				})
		})
		.post(function(req,res){
			// Regitro de informacion del formulario
			var nombres = req.body.nombres;
			var email = req.body.email;
			var especialidad = req.body.especialidad;
			var username= req.body.username;
			var password=req.body.password;
			// Encriptacion de contraseña
			var saltRounds = 10;
			var salt = bcrypt.genSaltSync(saltRounds);
			var hash = bcrypt.hashSync(password,salt);
			// Creacion de una nueva instancia del modelo user
			var user = new User({ 
				nombres: nombres, 
				email: email, 
				especialidad: especialidad,
				username: username,
				password: hash
			});

			// Guardar el usuario creado
			user.save(function(err){
				// Aseguramiento de no errores
				if( err ){
					console.log(err);
				} else {
					// Busqueda de la especialidad elegida
					Speciality.findOne({nombre: especialidad})
					.then( function(especialidad) {
						// Registro de nuevo usuario a su especialidad
						especialidad.users.push({ 
							nombres: user.nombres, 
							username:user.username, 
							ref:user._id 
						});
						// Aumento del numero de inscritos a la especialidad
						especialidad.inscritos++;
						// Guardar los cambios hechos en la especialidad
						especialidad.save(function(err) {
							// Aseguramiento de no errores
							if( err ){
								console.log(err);
							} else {
								// Redireccion a home
								res.redirect('/');
							}
						})
					})
				}		
			})

		});

//EXPORTACION
	module.exports = router;