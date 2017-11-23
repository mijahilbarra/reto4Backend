'use strict'

//REQUERIMIENTO
var router_main = require('../controllers/main.js');
var router_speciality = require('../api/speciality.js');
var router_user = require('../api/user.js');

// RUTEO
var routers = function(server) {
	server.use('/', router_main);
	server.use('/api/', router_speciality);
	server.use('/api/', router_user);
};

//EXPORTACION
module.exports = routers;