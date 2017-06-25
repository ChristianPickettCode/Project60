const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.specificShowScrape = (url, cb) => {

  request (url, (error, response, body) => {

    if (error) {
      cb ({
        error: error
      });
    }

    let $ = cheerio.load(body);
    let $url = url;

    var arr = [];

    $("#catlist-listview li a").each(function (i, elm) {
      title = $(this).text();
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);
      var EpName = urlPart.path;

      var show = {
        title: title,
        link : link,
        EpName : EpName
      }
      arr.push(show);
    });

    arr.reverse();

    let list = {
      url: $url,
      cartoonShowlist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
