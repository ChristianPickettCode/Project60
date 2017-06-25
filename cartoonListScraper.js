const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.cartoonListScrape = (url, cb) => {

  request (url, (error, response, body) => {

    if (error) {
      cb ({
        error: error
      });
    }

    let $ = cheerio.load(body);
    let $url = url;
    //let $list = $(".ddmcc li").text();

    var arr = [];

    $(".ddmcc li a").each(function (i, elm) {

      title = $(this).text();
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      if (urlPart.path.indexOf("/anime/") !== -1) {
        var pathName = urlPart.path.split('/anime/');
        var showName = pathName[1];

      } else {
        var pathName = urlPart.path.split('/');
        var showName = "Ep/" + pathName[1];
      }


      var show = {
        title : title,
        link : link,
        showName : showName
      }
      arr.push(show);

    });

    let $list = "ok";

    let list = {
      url: $url,
      cartoonShowlist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
