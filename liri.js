// Requirements
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys");

// Pulls keys from keys.js
var spotify = new Spotify(keys.spotify);

// Speeds up referencing user arguments
var input = process.argv;
var searchType = input[2];

// The statement runs the appropriate functions based on the user arguments
switch (searchType) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("----------------------------\nThis is not a valid command.");
}

// Function that chooses a random command and input to run from a local text file
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var parsedData = JSON.parse(data);
    var randomNumber = Math.floor(Math.random() * 3) * 2;
    var randomFunction = parsedData[randomNumber];
    var randomInput = parsedData[randomNumber + 1];

    switch (randomFunction) {
      case "concert-this":
        concertThis(randomInput);
        break;
      case "spotify-this-song":
        spotifyThisSong(randomInput);
        break;
      case "movie-this":
        movieThis(randomInput);
        break;
    }
  });
}

// Function that allows user to input an movie, and prints a variety of data about it
function movieThis(random) {
  var movie = input.slice(3).join("+");
  if (!movie) {
    movie = "mr+nobody";
  }
  if (random) {
    movie = random;
  }
  var queryURL =
    "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(queryURL).then(
    function(response) {
      if (response.data.Response === "False") {
        console.log("Movie not found");
      } else {
        console.log("Title: " + response.data.Title);
        console.log("\nYear: " + response.data.Year);
        console.log("\nIMDB Rating: " + response.data.Ratings[0].Value);
        console.log(
          "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value
        );
        console.log("\nCountries: " + response.data.Country);
        console.log("\nLanguages: " + response.data.Language);
        console.log("\nPlot: " + response.data.Plot);
        console.log("\nActors: " + response.data.Actors);
      }
    },
    function(error) {
      console.log(error.response);
    }
  );
}

// Function that allows user to input an artist, and prints data about said artists next three concerts
function concertThis(random) {
  var band = input.slice(3).join(" ");
  if (!band) {
    band = "metallica";
  }
  if (random) {
    band = random;
  }
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    band +
    "/events/?app_id=b7b374713cf3e2cf710b82eac648971e";

  axios.get(queryURL).then(
    function(response) {
      if (response.data.length === 0) {
        console.log("This artist has no upcoming shows");
      } else if (response.data[1] === "w") {
        console.log("No artist found");
      } else {
        console.log(
          "Here are some upcoming shows for " +
            band +
            "\n----------------------------"
        );
        for (i = 0; i < 3; i++) {
          console.log(response.data[i].venue.name);
          console.log(response.data[i].venue.city);
          console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
          console.log("\n");
        }
      }
    },
    function(error) {
      console.log(error.response);
    }
  );
}

// Function that allows user to input a song, and prints a variety of data about it
function spotifyThisSong(random) {
  var song = input.slice(3).join(",");
  if (!song) {
    song = "the,sign";
  }
  if (random) {
    song = random;
  }
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + "Can't find a matching song");
    } else {
      console.log(
        "Here is some info on this song.\n-------------------------------"
      );
      if (song !== "the,sign") {
        console.log("Artists: " + data.tracks.items[0].artists[0].name);
        console.log("\nTitle: " + data.tracks.items[0].name);
        console.log("\nAlbum: " + data.tracks.items[0].album.name);
        console.log("\nSpotify link: " + data.tracks.items[0].preview_url);
      } else {
        console.log("Artists: " + data.tracks.items[4].artists[0].name);
        console.log("\nTitle: " + data.tracks.items[4].name);
        console.log("\nAlbum: " + data.tracks.items[4].album.name);
        console.log("\nSpotify link: " + data.tracks.items[0].preview_url);
      }
    }
  });
}
