'use strict'

// REQUERIMIENTO DE MODULOS

	var express =  require('express');
	var swig = require('swig');
	var mongoose = require('mongoose');
	var bodyParser = require('body-parser');
	var cors = require('cors');

//CONFIGURACIONES

	// Creación del servidor web con express
	var server = express();

	// Integracion del motor de templates swig
	server.engine('html',swig.renderFile);
	server.set('view engine', 'html');
	server.set('views', __dirname + '/views');
	swig.setDefaults({cache: false});

/*	// Seteo de dirección de carpeta de archivos estaticos
	server.use(express.static(__dirname + '/public'));*/

	// Integración de body parser
	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(bodyParser.json());

	// Importacion de rutas
	require('./routers')(server);

	//Configuración de cors
	server.use(cors());


// CONFIGURACIONES DB

	// Integración de mongoose
	mongoose.connect('mongodb://mococho:123456@ds119306.mlab.com:19306/hackspace', { useMongoClient: true });
	mongoose.Promise = global.Promise;

// INICIAR SERVIDOR

	// Se corre el servidor en el puerto 5000
	server.listen(process.env.PORT || 5000, function() {
		console.log('El servidor esta escuchando en el puerto '+ 5000)
	});