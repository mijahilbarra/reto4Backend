'use strict'

// Requerimiento de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema

// Definición del esquema
var specialitySchema = new Schema({
	nombre: {type: String, required: true, unique: true},
	imagen: {type: String },
	inscritos: {type: Number, default: 0},
	created: {type: Date, default: Date.now},
	users:[
		{
			nombres: {type: String },
			username: {type: String},
			ref: {type: Schema.Types.ObjectId, ref: 'user'},

		}
	]
})

// Convertimos a modelo y exportamos
module.exports = mongoose.model('speciality', specialitySchema)


//Tipos de esquema permitidos

/*
	Number
	String
	Date
	Boolean
	Mixed
	Buffer
	ObjectId
	Array
*/