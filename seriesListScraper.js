const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.seriesListScrape = (url, cb) => {

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

    $("#left .listings li a").each(function (i, elm) {

      title = $(this).attr('title');
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      // if (urlPart.path.indexOf("/serie/") !== -1) {
      //   var pathName = urlPart.path.split('/serie/');
      //   var showName = pathName[1];
      //
      // } else {
      //   var pathName = urlPart.path.split('/');
      //   var showName = "Ep/" + pathName[1];
      //   console.log('ep')
      // }

      var pathName = urlPart.path.split('/serie/');
      var showName = pathName[1];

      //console.log(showName)

      var show = {
        title : title,
        link : link,
        showName : showName
      }
      arr.push(show);
      //console.log(title)

    });
    $("#right .listings li a").each(function (i, elm) {

      title = $(this).attr('title');
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      var pathName = urlPart.path.split('/serie/');
      var showName = pathName[1];

      var show = {
        title : title,
        link : link,
        showName : showName
      }
      arr.push(show);
      //console.log(title)

    });

    let $list = "ok";

    let list = {
      url: $url,
      seriesShowlist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
