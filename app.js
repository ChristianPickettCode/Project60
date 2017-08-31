
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const firebase = require('firebase').initializeApp({
  serviceAccount: "./cpcartoons-80e872d98344.json",
  databaseURL: "https://cpcartoons-d7fd2.firebaseio.com"
});

require('events').EventEmitter.prototype._maxListeners = 100;

const scraperList = require("./cartoonListScraper");
const scraperEp = require("./specificShowScraper");
const scraperVid = require("./findVideo");
const scraperSpookVid = require("./spookVideo");
const scraperSeriesList = require("./seriesListScraper");
const scraperSeriesSeason = require("./seriesSpecificShowSeasonScraper")
const scraperSeriesEp = require("./seriesShowEp");
const scraperSeriesEpLinksList = require("./seriesEpLinkScraper");
const scraperSeriesSpookVid = require("./seriesSpookVideo");
const scraperSeriesFindVideo = require("./seriesFindVideo");


const url = "https://www.watchcartoononline.io/";
const url2 = "https://www.watchcartoononline.io/anime/";
const url3 = "https://www.watchcartoononline.io/inc/animeuploads/embed.php?file=";
const url4 = "http://ewatchseries.to/letters/";
const url5 = "http://ewatchseries.to/serie/";
const url6 = "http://ewatchseries.to/";
const url7 = "http://ewatchseries.to/episode/";
const url8 = "http://ewatchseries.to/cale.html?r=";


const app = express();

var ref = firebase.database().ref('cartoons');
var watchedCartoonsRef = ref.child('list-of-watched-cartoons');

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

app.get('/Series', function(req, res) {

  var arr = ["09", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  res.render('seriesLetterList', {
    title : "Series",
    seriesList: arr
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



app.get('/Series/:letter', function(req, res) {

  var listURL = url4 + req.params.letter;

  scraperSeriesList.seriesListScrape(listURL, (data) => {
    seriesListArr = data;

    res.render('seriesList', {
      title : "Series, " + req.params.letter,
      seriesList: seriesListArr.seriesShowlist
    });
    //console.log(data)

  })

});

app.get('/series-show/:show', function(req, res) {

  var showURL = url5 + req.params.show;
  var showName = req.params.show;
  var title = findAndReplace(showName, '_', ' ');
  title = toTitleCase(title);

  scraperSeriesSeason.seriesSpecificShowSeasonScrape(showName, showURL, (data) => {
    seriesSeasonListArr = data;

    res.render('seriesSeason', {
      title : title,
      seriesSeasonListArr: seriesSeasonListArr.seriesShowSeasonlist
    });
    //console.log(data)

  })

});

app.get('/series-season/:show/:season', function(req, res) {

  var showURL = url6 + req.params.show + "/" + req.params.season;

  var showName = req.params.show + " : " + req.params.season;
  var title = findAndReplace(showName, '-', ' ');
  title = findAndReplace(title, '_', ' ');
  title = toTitleCase(title);

  scraperSeriesEp.seriesSpecificShowEpScrape(showURL, (data) => {
    seriesEpListArr = data;

    for (var i = 0; i < seriesEpListArr.seriesShowEplist.length; i++) {
      var epTitle = seriesEpListArr.seriesShowEplist[i].title
      epTitle = findAndReplace(epTitle, '_', ' ');
      epTitle = toTitleCase(epTitle);
      seriesEpListArr.seriesShowEplist[i].title = epTitle;
    }

    res.render('seriesEp', {
      title : title,
      seriesShowEplist: seriesEpListArr.seriesShowEplist
    });
    //console.log(data)

  })

});

app.get('/series-ep/:ep', function(req, res) {

  var showURL = url7 + req.params.ep;

  var showName = req.params.ep;
  var title = findAndReplace(showName, '-', ' ');
  title = findAndReplace(title, '_', ' ');
  title = findAndReplace(title, '.html', '');
  title = toTitleCase(title);

  scraperSeriesEpLinksList.seriesSpecificShowEpLinkScrape(showURL, (data) => {
    seriesEpLinkListArr = data;

    res.render('seriesEpLinks', {
      title : title,
      seriesShowEpLinklist: seriesEpLinkListArr.seriesShowEpLinklist
    });

  })

});

app.get('/link/:show/:linkID', function(req, res) {

  var vidURL = url8 + req.params.linkID;
  var showName = req.params.show;
  var title = findAndReplace(showName, '-', ' ');
  title = findAndReplace(title, '_', ' ');
  title = findAndReplace(title, '.html', '');
  title = toTitleCase(title);

  scraperSeriesSpookVid.seriesSpookVidScrape(vidURL, (dataSpook) => {

    scraperSeriesFindVideo.seriesSpookFindVidScrape(dataSpook, (data) => {
      res.render('seriesVideo', {
        title : req.params.show,
        seriesVid: data
      });

    });

  });



});

app.listen(app.get('port'), function() {
  console.log("Server On");
});
