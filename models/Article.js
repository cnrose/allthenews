//Require Mongoose
var mongoose = require("mongoose");

//Create Schema Class
var Schema = mongoose.Schema;

//Create Article Schema
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	link: {
		type: String,
		required: true,
	},
	notes: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}]
});

//Create Article model with ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//Export the Model
module.exports = Article;