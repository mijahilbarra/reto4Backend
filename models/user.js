'use strict'

//Requerimiento de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema

//Definición del esquema
var userSchema = new Schema({
	nombres: {type: String, required: true},
	email: {type: String, required: true, unique:true },
	especialidad: {type: String, required: true },
	username: {type: String, required: true, unique:true},
	password: {type: String, required: true},
	created: {type: Date, default: Date.now},
	is_super: {type: Boolean, default: false},
})

// Convertimos a modelo y exportamos
module.exports = mongoose.model('user', userSchema)