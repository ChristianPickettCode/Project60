
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const firebase = require('firebase').initializeApp({
  serviceAccount: "./cpcartoons-80e872d98344.json",
  databaseURL: "https://cpcartoons-d7fd2.firebaseio.com"
});

const scraperList = require("./cartoonListScraper");
const scraperEp = require("./specificShowScraper");
const scraperVid = require("./findVideo");
const scraperSpookVid = require("./spookVideo");


const url = "https://www.watchcartoononline.io/";
const url2 = "https://www.watchcartoononline.io/anime/";
const url3 = "https://www.watchcartoononline.io/inc/animeuploads/embed.php?file=";


const app = express();

var ref = firebase.database().ref('cartoons');
var watchedCartoonsRef = ref.child('list-of-watched-cartoons');

// watchedCartoonsRef.once('value')
//   .then(function(snap) {
//     //console.log(snap.val())
//     for (key in snap.val()) {
//       cartArr.push(snap.val()[key].name);
//     }
//   })

app.set('port', (process.env.PORT || 8000));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

function findAndReplace(string, target, replacement) {
  var i = 0, length = string.length;
  for (i; i < length; i++) {
    string = string.replace(target, replacement);
  }
  return string;
}

function toTitleCase(str){
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

app.get('/', function(req, res) {

  res.render('index', {
    title : "WELCOME"
  });

});

app.get('/home', function(req, res) {

  res.render('home', {
    title : "WELCOME"
  });

});

app.get('/favs', function(req, res) {

  res.render('favs', {
    title : "Favs"
  });

});

app.get('/recents', function(req, res) {

  res.render('recents', {
    title : "Recents"
  });

});

app.get('/cartoons', function(req, res) {

  var cartoonListArr = []
  var urlCartoons = url + "cartoon-list";

  scraperList.cartoonListScrape(urlCartoons, (data) => {
    cartoonListArr = data;

    res.render('list', {
      title : "CARTOONS",
      cartoonsList: cartoonListArr.cartoonShowlist
    });

  })

})

app.get('/anime', function(req, res) {

  var cartoonListArr = []
  var urlAnime = url + "dubbed-anime-list";
  scraperList.cartoonListScrape(urlAnime, (data) => {

    cartoonListArr = data;

    res.render('list', {
      title : "ANIME",
      cartoonsList: cartoonListArr.cartoonShowlist
    });
  })

})

app.get('/movies', function(req, res) {

  var cartoonListArr = []
  var urlMovies = url + "movie-list";
  scraperList.cartoonListScrape(urlMovies, (data) => {

    cartoonListArr = data;
    res.render('list', {
      title : "MOVIES",
      cartoonsList: cartoonListArr.cartoonShowlist
    });
  })

})

app.get('/:show', function(req, res) {

  var cartoonShowEpArr = []
  var epURL = url2 + req.params.show;
  scraperEp.specificShowScrape(epURL, (data) => {

    cartoonShowEpArr = data;
    var message = req.params.show + " Episodes";
    var title = findAndReplace(message, '-', ' ');
    title = toTitleCase(title);

    res.render('Episode', {
      title : title,
      cartoonsEpList: cartoonShowEpArr.cartoonShowlist
    });

  })

})

app.get('/Ep/:episode', function(req, res) {
  var vidURL = url + req.params.episode;

  var vidLinkAddr = ""
  var message = req.params.episode;
  var title = findAndReplace(message, '-', ' ');
  title = toTitleCase(title);

  scraperVid.findVideoScrape(vidURL, (data) => {

    scraperSpookVid.spookVidScrape(data.videoLink, (dataSpook) => {
      res.render('video', {
        title : title,
        cartoonVid: dataSpook
      });
    })

  })

})

app.listen(app.get('port'), function() {
  console.log("Server On");
});
