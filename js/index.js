var currentStreams = [], searchStreams = [],
  coders = ["/freecodecamp", "/storbeck", "/terakilobyte", "/habathcx",
    "/RobotCaleb", "/thomasballinger", "/noobs2ninjas", "/beohoff",
    "/comet404", "/brunofin"],
    userPhoto = "https://s-media-cache-ak0.pinimg.com/564x/fd/0c/55/fd0c559856ca991e9e28937dc802f0b0.jpg";

var baseURL = "https://api.twitch.tv/kraken/streams",
    userURL= "https://api.twitch.tv/kraken/streams",
  featuredExt = "/featured?limit=10",
  dotaExt = "?game=Dota 2&limit=10";

$(document).ready(function() {
  
  $("#featured").click(requestFeaturedStreams);
  $("#dota").click(requestDotaStreams);
  $("#coders").click(requestCodeStreams);
  
  requestFeaturedStreams();
});

function requestFeaturedStreams() {
  requestJSON(baseURL + featuredExt, loadFeaturedStreams);
}

function requestDotaStreams() {
  requestJSON(baseURL + dotaExt, loadDotaStreams);
}

function requestCodeStreams() {
  
  currentStreams.length = 0;
  coders.forEach(function(coder) {
    requestJSON(userURL + coder, loadCodeStreams, handleStreamError);
  });
}

function requestJSON(URL, SUCCESS_CALLBACK, ERROR_CALLBACK) {
  
  $("#search").val("");
  ERROR_CALLBACK = ERROR_CALLBACK || SUCCESS_CALLBACK;

  var data = $.ajax({
    type: 'GET',
    url: URL,
    headers: {
      'Client-ID': '8fxw6t0toytznkl7h1guwcjfllk7zf4'
    },
    success: SUCCESS_CALLBACK,
    error: ERROR_CALLBACK
  });
}

function loadFeaturedStreams(data) {

  currentStreams.length = 0; 
  var featuredList = data.featured;
  featuredList.forEach(function(featuredItem) {
    currentStreams.push(featuredItem.stream);
  });
  
  displayStreamData(currentStreams);
}

function loadDotaStreams(data) {

  currentStreams.length = 0;
  
  //Place all streams in currentStreams array - Used for searching
  currentStreams = data.streams; 
  displayStreamData(currentStreams);
}

function loadCodeStreams(data) {

  //Check if the user is streaming
  if (data.stream == null) {

    //Update the stream values to reflect offline users
    data.stream = {

      game: "Offline",
      viewers: 0,
      channel: {

        logo: null,
        name: data._links.self.substr(37)
      }
    }
  }

  currentStreams.push(data.stream);
  displayStreamData(currentStreams);  
}

function handleStreamError(data) {
  
  console.log(arguments);
  console.log(data);
  var errorString = JSON.parse(data.responseText);
  console.log(errorString);
  //Update the stream values to reflect 404 users
  data.stream = {

      game: errorString.message,
      viewers: 404,
      channel: {

        logo: null,
        name: errorString.error
      }
    }
  
  currentStreams.push(data.stream);
  displayStreamData(currentStreams); 
}

function search() {

  searchStreams.length = 0;
  var searchTerm = $("#search").val();
  console.log(searchTerm);
  
  if (searchTerm == "")
    displayStreamData(currentStreams);
  else {

    currentStreams.forEach(function(stream) {
      
      if (stream.channel.name.match(searchTerm))
        searchStreams.push(stream);
    });
    
    displayStreamData(searchStreams);
  }
}

//Function deletes all old stream html and inserts a new div for every streamer
function displayStreamData(streams) {

  $("#insert-target").empty();
    streams.forEach(function(stream) {
    var $container = $("#streamcontainer").clone();
    $container.css("display", "block");

    if(stream.channel.logo == null)
      stream.channel.logo = userPhoto;
    $container.find("img").attr("src", stream.channel.logo);
      
    $container.find("#name").html(stream.channel.name);
    $container.find("#game").text(stream.game);
    $container.find("#viewers").text("Viewers: " + stream.viewers);
    $container.find("#click-target").click(clickHandler);
    $("#insert-target").append($container);
  });
}

function clickHandler() {
  window.open("https://www.twitch.tv/" + $(this).find("#name").text(), "_blank");
}