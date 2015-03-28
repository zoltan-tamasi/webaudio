var context;
var source;
var selectedId;

function formatFileSize(filesize) {
    if (filesize >= 1000000) {
        return parseFloat(filesize / 1000000).toFixed(1) + " MB";
    }
    if (filesize > 1000) {
        return parseFloat(filesize / 1000).toFixed(1) + " KB";
    }
    return filesize;
}

function formatDuration(duration) {
    var min = parseInt(duration / 60);
    if (min < 10) {
        min = "0" + min;
    }

    var sec = parseInt(duration % 60);
    if (sec < 10) {
        sec = "0" + sec;
    }

    return min + ":" + sec + "." + parseFloat(duration % 1).toFixed(1) * 10;
}

var canvasWidth = 900;
var canvasHeight = 200;
var newCanvas = createCanvas(canvasWidth, canvasHeight);

function createCanvas (w, h) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width  = w;
    newCanvas.height = h;
    return newCanvas;
};

function displayBuffer(buff) {
    var leftChannel = buff.getChannelData(0);
    var rightChannel = buff.numberOfChannels == 1 ? buff.getChannelData(0) : buff.getChannelData(1);
    var lineOpacity = canvasWidth / leftChannel.length;
    canvas.save();
    canvas.fillStyle = '#222';
    canvas.fillRect(0, 0, canvasWidth, canvasHeight);
    canvas.strokeStyle = '#5A5';
    canvas.globalCompositeOperation = 'lighter';
    canvas.translate(0, canvasHeight / 2);
    canvas.globalAlpha = 0.6;
 
    var partitionLength = parseInt(leftChannel.length / canvasWidth);
    var parts = parseInt(leftChannel.length / partitionLength);
 
    var slice, absval, x, y, max;
    for (var i = 0; i <= parts; i++) {
        slice = leftChannel.subarray(i * partitionLength, i * partitionLength + partitionLength);
        max = 0;
        for (val in slice) {
            absval = Math.abs(slice[val]);
            max = absval > max ? absval : max;
        }

        x = i;
        y = -(max * canvasHeight / 2);
        canvas.beginPath();
        canvas.moveTo(x, 0);
        canvas.lineTo(x + 1, y);
        canvas.stroke();

        slice = rightChannel.subarray(i * partitionLength, i * partitionLength + partitionLength);
        max = 0;
        for (val in slice) {
            absval = Math.abs(slice[val]);
            max = absval > max ? absval : max;
        }

        y = max * canvasHeight / 2;
        canvas.beginPath();
        canvas.moveTo(x, 0);
        canvas.lineTo(x + 1, y);
        canvas.stroke();
    }
    canvas.restore();
    console.log('done');
}


function select(id) {
    stopSound();
    loading(false);
    selectedId = id;
    $.get("/sounddata/" + id, function(audio) {
        var audio = JSON.parse(audio);
        $("#selected-sample").html([
            $("<table>").addClass("table").css("margin", "0px auto").html([
                $("<tr>").html([ $("<td>").css("text-align", "left").text("name:"), $("<td>").css("text-align", "left").text(audio.name) ]),
                $("<tr>").html([ $("<td>").text("type:"), $("<td>").text(audio.type) ]),
                $("<tr>").html([ $("<td>").text("channels:"), $("<td>").text(audio.channels) ]),
                $("<tr>").html([ $("<td>").text("filesize:"), $("<td>").text(formatFileSize(audio.filesize)) ]),
                $("<tr>").html([ $("<td>").text("bitrate:"), $("<td>").text(audio.bitrate) ]),
                $("<tr>").html([ $("<td>").text("bitdepth:"), $("<td>").text(audio.bitdepth) ]),
                $("<tr>").html([ $("<td>").text("duration:"), $("<td>").text(formatDuration(audio.duration)) ]),
                $("<tr>").html([ $("<td>").text("samplerate:"), $("<td>").text(audio.samplerate) ])
            ])
        ]);

        $("#generated-image").hide();
        $("#downloaded-image")
            .html($("<img>").attr("src", audio.images.waveform_l))
            .show();
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
            $("<h5>").addClass("list-group-item-heading").html([
                $("<span>").text(audio.name),
                $("<small>").html([
                    $("<span>").text("  license: "),
                    $("<a>").text(audio.license).attr("href", audio.license)])
            ]),
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

function loadSound(id) {
    loading(true);
    var request = new XMLHttpRequest();
    var url = 'downloadsound/' + id;
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            soundBuffer = buffer;
            playSound(soundBuffer);
            loading(false);
        }, function(err) { console.error(err); });
    }
    request.send();
}

function playSound(buffer) {
    source = context.createBufferSource(); 
    source.buffer = buffer;                    
    source.connect(context.destination);
    displayBuffer(soundBuffer);
    $("#downloaded-image").hide();
    $("#generated-image").show();
    source.start(0);                           
}

function stopSound() {
    if (source !== undefined) source.stop(0);
}

function loading(loading) {
    if (loading) {
        $("#loading").show();
        $("#play-button, #pause-button").hide();
    } else {
        $("#loading").hide();
        $("#play-button, #pause-button").show();
    }
}

$("#search").keypress(function (e) {
    if (e.which == 13) {
        search();
    }
});

$("#search-button").click(function() { search(); });

$("#play-button").click(function() {
    loadSound(selectedId);
});

$("#pause-button").click(function() {
    stopSound();
});

$(function() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

        $("#generated-image").append(newCanvas);
        canvas = newCanvas.getContext('2d');
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
});

