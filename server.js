//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var port = process.env.PORT || 3000;
//Require Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

//Require Scraping tools
var request = require("request");
var cheerio = require("cheerio");

//set mongoose promise
mongoose.Promise = Promise;

//initialize express
var app = express();

//use morgan and body-parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

// //Set Handlebars
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({defaultLayout: "main" }));
// app.set("view engine", "handlebars");

//make public a static directory
app.use(express.static("public"));

//database configuration with mongoose
mongoose.connect("mongodb://localhost/newsdb");
var db = mongoose.connection;

//Show any mongoose errors
db.on("open", function() {
	console.log("Mongoose connection successful.");
});



//Routes
//GET request tot scrape npr food news website
app.get("/scrape", function(req, res) {
	//grab body of html with request
	request("http://www.npr.org/sections/food/", function(error, response, html) {
		//load html body into cheerio and set to $ selector
		var $ = cheerio.load(html);
		//grab every h2 with class of "title" and format then save to db
		$("h2.title").each(function(i, element) {
			//empty results object
			var result = {};

			//add title text and href of every article and save as properties of the results object
			result.title = $(this).text();
			result.link = $(this).children().attr("href");
	
			//use Article model to create new entry
			var entry = new Article(result);

			//save the entry to the db
			entry.save(function(err, doc) {
				if(err) {
					console.log(err);
				} 
				else {
					console.log(doc);
				}
			});
			
		});
		//res.send("Scrape Complete")
		res.redirect("/");	
	});
});	

//get articles we've scraped from mongodb
app.get("/articles", function(req, res) {
	//grab every doc in Articles collection
	Article.find({}, function(error, doc){
		if(error) {
			console.log(error);
		}
		else{
			res.json(doc);
		}
	});
});

//find article with specific id
app.get("/articles/:id", function(req, res) {
	Article.findOne({ "_id" : req.params.id})
		.populate("notes")
		.exec(function(error, doc) {
			if (error) {
				console.log(error);	
			}
			else {
				res.json(doc);
			}
	});	
});

//save a new note
app.post("/articles/:id", function(req, res) {
	var newNote = new Note(req.body);

	newNote.save(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			Article.findOneAndUpdate({"_id" : req.params.id}, { $push: {"notes": doc._id} }, function(err, newdoc){
				if(err){
					res.send(err)
				}
				else {
					res.send(newdoc);
				}
			});
		}
	});
});

//delete a note
// Delete functionality not working. Id is unknown
app.post("/delete/:id", function(req, res) {
	
	Note.remove({ "_id" : req.params.id})
		.exec(function(error, doc) {
			if(error) {
				console.log(error);
			}
			else {
				console.log("note deleted");
				res.redirect("/");
			}
	});
});

app.listen(port, function(){
	console.log("App is running");
});