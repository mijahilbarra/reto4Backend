'use strict'
// REQUERIMIENTOS

var bcrypt = require('bcryptjs');
//Requerimiento de modelo user
var User = require('../models/user'); 

// VERIFICACION
var access = function(req,res,next){
	// Obtener variables de verificacion
	var auth = req.headers['authorization'];
	if(auth){
		var tmp = auth.split(' ');   
		var buf = new Buffer(tmp[1], 'base64'); 
		var plain_auth = buf.toString();        
		var creds = plain_auth.split(':');
		var username = creds[0];
		var password = creds[1];
		// Buscamos el usuario 
		User.findOne({username: username})
		.then(function(usuario){
			if(usuario){
				if(usuario.is_super == true){
					if(bcrypt.compareSync(password,usuario.password)){
						return next();
					}else{
						return res.json({success:false,error:"La contraseña es incorrecta."})	
					}	
				}else{
					return res.json({success:false,error:"El usuario no tiene permisos."})
				}
			}else{
				return res.json({success:false,error:"El usuario no existe."})
			}
		})

	}else{
		return res.json({success:false,error:"El contenido no esta disponible."})
	}
}
// EXPORTACION

module.exports = access;