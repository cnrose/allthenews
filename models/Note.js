//Require Mongoose
var mongoose = require("mongoose");

//Create schema class
var Schema = mongoose.Schema;

//Create Note Schema
var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

//Create Note Model
var Note = mongoose.model("Note", NoteSchema);

//Export Note Model
module.exports = Note;