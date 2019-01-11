require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys");

var spotify = new Spotify(keys.spotify);

var input = process.argv;

function concertThis() {
  var band = "";
  for (i = 3; i < input.length; i++) {
    band += input[i];
  }
  if (band === "") {
    band = "metallica";
  }
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    band +
    "/events/?app_id=b7b374713cf3e2cf710b82eac648971e";

  axios.get(queryURL).then(
    function(response) {
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
    },
    function(error) {
      console.log(error.response);
    }
  );
}

function spotifyThisSong() {
  spotify.search({ type: "track", query: input[3] }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      console.log(
        "Here is some info on this song.\n-------------------------------"
      );
      console.log(data.tracks.items[0].album.name);
      console.log("Artists: " + data.tracks.items[0].artists[0].name);
      console.log("\nTitle: " + data.tracks.items[0].name);
      console.log("\nAlbum: " + data.tracks.items[0].album.name);
      console.log("\nSpotify link: " + data.tracks.items[0].preview_url);
    }
  });
}

switch (input[2]) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  default:
    console.log("----------------------------\nThis is not a valid command.");
}

debugger;
