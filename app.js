
const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path')

const scraperList = require("./cartoonListScraper");
const scraperEp = require("./specificShowScraper");
const scraperVid = require("./findVideo");
const scraperSpookVid = require("./spookVideo");


const url = "https://www.watchcartoononline.io/";
const url2 = "https://www.watchcartoononline.io/anime/";
const url3 = "https://www.watchcartoononline.io/inc/animeuploads/embed.php?file=";


var app = express();
//var port = 8000;

app.set('port', (process.env.PORT || 8000));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {

  res.render('index', {
    title : "WELCOME"
  });

})

app.get('/cartoons', function(req, res) {

  var cartoonListArr = []
  var urlCartoons = url + "cartoon-list";

  scraperList.cartoonListScrape(urlCartoons, (data) => {
    //console.log("data recieved")
    cartoonListArr = data;
    //console.log(data);

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
    //console.log("data recieved")
    cartoonListArr = data;
    //console.log(data);

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
    //console.log("data recieved")
    cartoonListArr = data;
    //console.log(data);

    res.render('list', {
      title : "MOVIES",
      cartoonsList: cartoonListArr.cartoonShowlist
    });
  })

})

app.get('/:show', function(req, res) {
  //console.log("req: " + req.params.show);

  var cartoonShowEpArr = []
  var epURL = url2 + req.params.show;
  scraperEp.specificShowScrape(epURL, (data) => {
    //console.log("data recieved EP");
    cartoonShowEpArr = data;

    var message = req.params.show + " Episodes";

    res.render('Episode', {
      title : message,
      cartoonsEpList: cartoonShowEpArr.cartoonShowlist
    });

  })

})
  
app.get('/Ep/:episode', function(req, res) {
  //console.log("req: " + req.params.episode);

  var vidURL = url + req.params.episode;

  var vidLinkAddr = ""
  var message = req.params.episode;

  scraperVid.findVideoScrape(vidURL, (data) => {

    scraperSpookVid.spookVidScrape(data.videoLink, (dataSpook) => {
      res.render('video', {
        title : message,
        cartoonVid: dataSpook
      });
    })

  })

})

app.listen(app.get('port'), function() {
  console.log("Server On");
});
