'use strict'

// VARIABLES 

var especialidades = [	
	{
		nombre: 'FRONTEND',
		imagen: 'frontend.png'
	},
	{
		nombre: 'BACKEND',
		imagen: 'backend.png'
	},
	{
		nombre: 'ELECTRONICA',
		imagen: 'electronica.png'
	},
	{
		nombre: 'ANDROID',
		imagen: 'android.png'
	},
	{
		nombre: 'ALGORITMOS',
		imagen: 'algoritmos.png'
	},
];

var titulo = "The Simpson";

var persona = {
	nombres: "Bartolomeo H.",
	apellidos: "Simpson",
	edad: "10",
	img: "bart.jpg",
};

var amigos = [
	{
		nombres: "Homer J",
		apellidos: "Simpson",
		edad: "34",
		img: "homer.jpg",
	},
	{
		nombres: "Marjorie H.",
		apellidos: "Bouvier",
		edad: "34",
		img: "marge.jpg",
	},
	{
		nombres: "Lisa",
		apellidos: "Simpson",
		edad: "8",
		img: "lisa.jpg",
	},
	{
		nombres: "Margaret",
		apellidos: "Simpson",
		edad: "2",
		img: "maggie.jpg",
	},
];

// REQUERIMIENTO DE MODULOS

var express =  require('express');
var swig = require('swig');

//CONFIGURACIONES

// Creación del servidor web con express
var server = express();

// Integracion del motor de templates swig
server.engine('html',swig.renderFile);
server.set('view engine', 'html');
server.set('views', __dirname + '/views');
swig.setDefaults({cache: false});

// Seteo de dirección de carpeta de archivos estaticos
server.use(express.static(__dirname + '/public'));

// PETICIONES

// Cuando exista una petición en el servidor  
server.get('/',function(req,res){
	res.render('especialidades.html', { categorias:especialidades, titulo:titulo, persona:persona, amigos:amigos });
});

// INICIAR SERVIDOR

// Se corre el servidor en el puerto 8000
server.listen(8000, function() {
	console.log('El servidor esta escuchando en el puerto '+ 8000)
});