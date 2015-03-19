function select(id) {
	$.get("/sounddata/" + id, function(audio) {
		var audio = JSON.parse(audio);
		$("#selected-sample").html([
			$("<table>").addClass("table").css("margin", "0px auto").html([
				$("<tr>").html([ $("<td>").css("text-align", "left").text("name:"), $("<td>").css("text-align", "left").text(audio.name) ]),
				$("<tr>").html([ $("<td>").text("type:"), $("<td>").text(audio.type) ]),
				$("<tr>").html([ $("<td>").text("channels:"), $("<td>").text(audio.channels) ]),
				$("<tr>").html([ $("<td>").text("filesize:"), $("<td>").text(audio.filesize) ]),
				$("<tr>").html([ $("<td>").text("bitrate:"), $("<td>").text(audio.bitrate) ]),
				$("<tr>").html([ $("<td>").text("bitdepth:"), $("<td>").text(audio.bitdepth) ]),
				$("<tr>").html([ $("<td>").text("duration:"), $("<td>").text(audio.duration) ]),
				$("<tr>").html([ $("<td>").text("samplerate:"), $("<td>").text(audio.samplerate) ])
			])
		]);

		$("#waveform").html($("<img>").attr("src", audio.images.waveform_l));
	});
}

function template(audio) {
	return $("<a>").attr("href", "#").addClass("list-group-item")
		.click(function() {
			$("#search-results .list-group-item").removeClass("active");
			$(this).addClass("active");
			select(audio.id);
		})
		.html([
			$("<h5>").addClass("list-group-item-heading").text(audio.name),
			$("<p>").addClass("list-group-item-text").html(
				audio.tags.slice(0, 8).map(function(tag) {
					return $("<span>").addClass("badge").css("margin-right", "5px").text(tag); 
				})
			)
		]);
}

function search(page) {
	var text = $("#search").val();
	var page = page ? parseInt(page, 10) : 1;
	$.get("/textsearch/" + text + "/" + page, function(response) {
		var response = JSON.parse(response);
		$("#search-results").html([
			$("<div>").addClass("list-group").html(
				response.results.map(template)
			),
			$("<nav>").html(
				$("<ul>").addClass("pager").html([
					response.previous === null ? null : $("<li>").html($("<a>").attr("href", "#").text("Previous").click(function() { search(page - 1); })),
					response.next === null ? null : $("<li>").html($("<a>").attr("href", "#").text("Next").click(function() { search(page + 1); }))
				])
			)
		]);
		$("#search-results").scrollTop(0)
	});
}

$("#search").keypress(function (e) {
	if (e.which == 13) {
		search();
	}
});

$("#search-button").click(function() { search(); });