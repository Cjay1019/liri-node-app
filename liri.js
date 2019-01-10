require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

var spotify = new Spotify({
  id: "ea81dd2368024cc1875740be7b70e1bc",
  secret: "70425be3e30744fdafd69351144a96af"
});

var input = process.argv;

function concertThis() {
  var band = "";
  for (i = 3; i < input.length; i++) {
    band += input[i];
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
      console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
      console.log("\nTitle: " + data.tracks.items[0].album.artists[0].name);
    }
  });
}

if (input[2] === "concert-this") {
  concertThis();
} else if (input[2] === "spotify-this-song") {
  spotifyThisSong();
}
