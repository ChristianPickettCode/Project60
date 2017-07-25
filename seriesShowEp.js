const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.seriesSpecificShowEpScrape = (url, cb) => {

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

    $("#left div[itemprop='season'] .listings li a").each(function (i, elm) {

      //title = $(this).attr('href');
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      var pathName = urlPart.path.split("/episode/");
      var epName = pathName[1];

      var epAddress = epName;

      pathName = epName.split(".html");
      epName = pathName[0];

      var ep = {
        title : epName,
        link : link,
        epAddress: epAddress
        // seasonName : seasonName,
        // showName : showName
      }
      arr.push(ep);
      // console.log(link)

    });

    arr.reverse();

    let $list = "ok";

    let list = {
      url: $url,
      seriesShowEplist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
