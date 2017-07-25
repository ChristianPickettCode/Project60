const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.seriesSpecificShowEpLinkScrape = (url, cb) => {

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
    var linkNum = 1;
    
    $("#linktable #myTable tbody tr td:nth-child(2) a").each(function (i, elm) {

      title = $(this).attr('title');
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      var pathName = urlPart.path.split('/cale.html?r=');
      var linkID = pathName[1];

      var epLink = {
        title : title,
        link : link,
        linkID : linkID,
        linkNum : linkNum
      }



      if (title != "Sponsored" && title == "gorillavid.in") {
        arr.push(epLink);
        linkNum = linkNum + 1;
        //console.log(title)
      }

    });

    let $list = "ok";

    let list = {
      url: $url,
      seriesShowEpLinklist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
