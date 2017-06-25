const request = require('request');
const cheerio = require('cheerio');

// Callback
exports.findVideoScrape = (url, cb) => {

  request (url, (error, response, body) => {

    if (error) {
      cb ({
        error: error
      });
    }

    let $ = cheerio.load(body);
    let $url = url;

    var videoLink = $(".larkax iframe").get(1);
    var videoLinkText = $(videoLink).attr("src");

    let vid = {
      url: $url,
      videoLink: videoLinkText
    }

    //console.log("Scraped");
    cb(vid)

  })

}
