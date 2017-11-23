'use strict'

//REQUERIMIENTOS

	var express = require('express');
	var router = express.Router();
	var bcrypt = require('bcryptjs');
	//Requerimiento de modelo speciality
	var Speciality = require('../models/speciality');
	//Requerimiento de modelo user
	var User = require('../models/user');  
	//Requerimiento de middleware access
	var Access = require('../middlewares/access'); 
//OPERACIONES

	//READ

		// Operacion Read a toda la coleccion
		router.route('/users')
			.get(function(req,res){
				// Obtener toda la coleccion users
				User.find()
				.then( function(usuarios) {
					// Inciar de JSON
					var informacion = [];
					// Recorrido por informacion 
					usuarios.forEach(function (usuario){
						// Seleccion de informacion a servir
						var user = {
							nombres: usuario.nombres,
							email: usuario.email,
							especialidad: usuario.especialidad,
							username: usuario.username
						}
						// Incorporacion de regitro al JSON
						informacion.push(user);
					})
					// Servir informacion.
					res.json(informacion);
				})
			});



		// Operacion Read a un registro en particular
		router.route('/users/:username')
			.get(function(req,res){
				// Obtencion de parametros de url
				var username = req.params.username;
				// Busqueda de resgitro particular
				User.findOne({username:username})
				.then( function(usuario) {
					// Seleccion de informacion a servir
					var user = {
						nombres: usuario.nombres,
						email: usuario.email,
						especialidad: usuario.especialidad,
						username: usuario.username
					}
					// Servir registro
					res.json(user);  
				})
			});

	// CREATE

		// Operacion Create en la coleccion
		router.route('/users')
			.post(function(req,res){
				// Obtencion de variables del body
				var nombres = req.body.nombres;
				var email = req.body.email;
				var especialidad = req.body.especialidad;
				var username = req.body.username;
				var password = req.body.password;
				// Encriptacion de contraseña
				var saltRounds = 10;
				var salt = bcrypt.genSaltSync(saltRounds);
				var hash = bcrypt.hashSync(password,salt);
				// Creacion de un nuevo registro de usuario
				var usuario = new User({ 
					nombres: nombres, 
					email: email,
					especialidad: especialidad,
					username: username,
					password: hash,
				})
				// Almacenamiento del registro en la base de datos
				usuario.save(function(err) {
					if (err) {
						// Si hay un error al momento de guardar el registro 
						// nos muestra success:false y cual fue el error 
						console.log(err);
						res.json({success:false,error:err});
					} else {
						//Busca la especialidad elegida por el usuario
						Speciality.findOne({nombre: especialidad })
						.then( function(especialidad) {
							// Registro de nuevo usuario a su especialidad
							especialidad.users.push({ 
								nombres: usuario.nombres, 
								username: usuario.username, 
								ref: usuario._id 
							});
							// Aumento del numero de inscritos a la especialidad
							especialidad.inscritos++;
							// Guardar los cambios hechos en la especialidad
							especialidad.save(function(err) {
								// Aseguramiento de no errores
								if( err ){
									// Si hay un error al momento de guardar el registro 
									// nos muestra success:false y cual fue el error 
									console.log(err);
									res.json({success:false,error:err});
								} else {
									// Si el registro se completo sin errores 
									// nos devuelve success:true y el registro creado
									res.json({success:true,usuario:usuario});
								}
							})
						})
					}
				})
			});

	// UPDATE

		router.route('/users/:username')
			.put(Access, function(req,res){
				// Obtencion de parametros de url
				var username = req.params.username;
				// Obtencion de variables del body
				var new_nombres = req.body.nombres;
				var new_email = req.body.email;
				var new_especialidad = req.body.especialidad;
				var new_username = req.body.username;
				var new_password = req.body.password;
				// Busqueda del registro por su nombre unico
				User.findOne({username:username})
				.then( function(usuario) {

					// Almacenamos la especialidad anterior del usuario
					var old_espepecialidad = usuario.especialidad;
					// Almacenamos el username anterior
					var old_username = usuario.username;
					// Si hay actualizacion en el email
					if(new_email) {
						// Registro de nuevo email
						usuario.email = new_email;
					}
					// Si hay actualizacion en la contraseña
					if(new_password) {
						// Encriptacion de contraseña
						var saltRounds = 10;
						var salt = bcrypt.genSaltSync(saltRounds);
						var hash = bcrypt.hashSync(new_password,salt);
						// Registro de nueva contraseña encriptada
						usuario.password = hash;
					}
					// Si hay actualizacion en los nombres 
					if(new_nombres) {
						// Si no hay cambio no actualizar
						if( new_nombres != usuario.nombres){
							// Registro de nuevos nombres
							usuario.nombres = new_nombres;
							// Buscamos la especialidad
							Speciality.findOne({nombre: old_espepecialidad })
							.then( function(especialidad) {
								// Buscamos al usuario
								var user = especialidad.users.find(function(user) {
									return user.username == old_username;
								});
								// Actualizamos los nombres 
								user.nombres = new_nombres;
								// Actualizamos el registro de la especialidad
								especialidad.save(function(err){
									if(err) {
										// Si hay un error al momento de guardar el registro 
										//nos muestra success:false y cual fue el error 
										console.log(err);
										res.json({success:false,error:err});
									}
								});
							})
						}
					}
					// Si hay actualizacion en el username   
					if(new_username) {
						if( new_username != usuario.username){
							// Registro de nueva username
							usuario.username = new_username;
							// Buscamos la especialidad
							Speciality.findOne({nombre: old_espepecialidad })
							.then( function(especialidad) {
								// Buscamos al usuario
								var user = especialidad.users.find(function(user) {
									return user.username == old_username;
								});
								// Actualizamos el username 
								user.username = new_username;
								especialidad.save(function(err){
									if(err) {
										// Si hay un error al momento de guardar el registro 
										//nos muestra success:false y cual fue el error 
										console.log(err);
										res.json({success:false,error:err});
									}
								});
							})
						}	
					}

					// Si hay actualizacion en la especialidad   
					if(new_especialidad) {
						if( new_especialidad !=  usuario.especialidad ){
							Speciality.findOne({nombre: new_especialidad })
							.then( function(especialidad,err) {
								// Registro de nueva especialidad
								usuario.especialidad = new_especialidad;
								// Indexamos el registro a la nueva especialidad
								especialidad.users.push({ 
									nombres: usuario.nombres, 
									username: usuario.username, 
									ref:usuario._id, 
								});
								especialidad.inscritos++;
								especialidad.save(function(err) {
									if( err ){
										// Si hay un error al momento de guardar el registro 
										//nos muestra success:false y cual fue el error 
										console.log(err);
										res.json({success:false,error:err});
									}else{
										console.log("Estoy pasando por aqui")
										// Eliminar el registro de la especialidad anterior
										Speciality.findOne({nombre:old_espepecialidad})
										.then(function(especialidad_anterior){
											especialidad_anterior.inscritos--;
											var user = especialidad_anterior.users.find(function(user) {
												return user.username == old_username;
											});
											user.remove();
											especialidad_anterior.save(function(err){
												if(err) {
													// Si hay un error al momento de guardar el registro 
													//nos muestra success:false y cual fue el error 
													console.log(err);
													res.json({success:false,error:err});
												}else{
													// Actualizar el registro de usuario en la base de datos
													usuario.save(function(err){
														if(err) {
															// Si hay un error al momento de guardar el registro 
															//nos muestra success:false y cual fue el error 
															console.log(err);
															res.json({success:false,error:err});
														}else{
															// Si el registro se completo sin errores 
															// nos devuelve success:true y el registro creado
															res.json({success:true,usuario:usuario})
														}	
													})
												}
											});
										})
									}  
								})
							})
						}else{
							// Actualizar el registro de usuario en la base de datos
							usuario.save(function(err){
								if(err) {
									// Si hay un error al momento de guardar el registro 
									//nos muestra success:false y cual fue el error 
									console.log(err);
									res.json({success:false,error:err});
								}else{
									// Si el registro se completo sin errores 
									// nos devuelve success:true y el registro creado
									res.json({success:true,usuario:usuario})
								}	
							})
						}
					}else{
						// Actualizar el registro de usuario en la base de datos
						usuario.save(function(err){
							if(err) {
								// Si hay un error al momento de guardar el registro 
								//nos muestra success:false y cual fue el error 
								console.log(err);
								res.json({success:false,error:err});
							}else{
								// Si el registro se completo sin errores 
								// nos devuelve success:true y el registro creado
								res.json({success:true,usuario:usuario})
							}	
						})	
					} 		 	
					
				})
			});

	// DELETE

		// Operacion delete de un registro en particular
		router.route('/users/:username')
			.delete(Access, function(req,res){
				// Obtencion de parametros de url
				var username = req.params.username;
				// Busqueda del registro por su nombre unico
				User.findOne({username:username})
				.then(function(usuario) {
					// Eliminar el registro de la especialidad 
					Speciality.findOne({nombre:usuario.especialidad})
					.then(function(especialidad){
						especialidad.inscritos--;
						var user = especialidad.users.find(function(user) {
							return user.username == username;
						});
						user.remove();
						especialidad.save( function(err){
							if(err) {
								// Si hay un error al momento de guardar el registro 
								//nos muestra success:false y cual fue el error 
								console.log(err);
								res.json({success:false,error:err});
							}else{
								usuario.remove(function(err){
									if(err) {
										// Si hay un error al momento de guardar el registro 
										//nos muestra success:false y cual fue el error 
										console.log(err);
										res.json({success:false,error:err});
									}else{
										// Si el registro se completo sin errores 
										// nos devuelve success:true y el registro creado
										res.json({success:true})
									}
								})	
							}

						})
					})
				})
			});

//EXPORTACION
	module.exports = router;