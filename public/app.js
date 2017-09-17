$(document).on("click", "#scrape", function(event){
	event.preventDefault();
//Grab the articles as a json
	$.getJSON("/articles", function(data) {
		//loop through each article to find info to display
		for (var i = 0; i < data.length; i++) {
			//displays id, title and clickable link
			$("#articles").append("<div class='panel panel-default'><div class='panel-heading'> <p>" + data[i].title + "<button class='btn-primary pull-right' data-id='" + data[i]._id + "'id='displaynote'>Note</button></p></div>" + "<div class='panel-body'><a href='" + data[i].link + "' target='_blank'>Link to Article</p></div></div>");
		}
	});
});
//When someone clicks on a p tag (the article title), do this
$(document).on("click", "#displaynote", function() {
	//empty notes section
	$("#notes").empty();
	//save id in p tag
	var thisId = $(this).attr("data-id");

	//Make ajax call to get the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	// when call has been made, add the note information to the page
	// Currently only displaying last note saved, but working on getting all notes to display
	.done(function(data) {
		console.log(data);
		//title of the note
		$("#notes").append("<h4>" + data.title + "</h4>");
		//input fields for new notes
		$("#notes").append("<input id='titleinput' name='title' placeholder='title'>");
		$("#notes").append("<textarea id='bodyinput' name='body' placeholder='note'></textarea>");
		//save and delete buttons
		$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
		$("#notes").append("<button data-id='" + data.notes._id + "' id='deletenote'>Delete Note</button>");
		//if there is a note, display data
		if (data.notes) {
			for (var i = 0; i < data.notes.length; i++) {
				$("#titleinput").val(data.notes[i].title);
				$("#bodyinput").val(data.notes[i].body);
			}
		}	
	});
});

//clicking the save note button
$(document).on("click", "#savenote", function() {
	//grab id associated with article 
	var thisId = $(this).attr("data-id");

	//run a POST request to save the note
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})
	.done(function(data) {
		console.log(data);
		$("#notes").empty();
	});
	$("#titleinput").val("");
	$("#bodyinput").val("");
});

//clicking delete button
$(document).on("click", "#deletenote", function() {
	var thisId = $(this).attr("data-id");

	//run delete method
	$.ajax({
		method: "DELETE",
		url: "/delete/" + thisId
	})
	.done(function(data) {
		$("#notes").empty();
	});
	$("#titleinput").val("");
	$("#bodyinput").val("");
});