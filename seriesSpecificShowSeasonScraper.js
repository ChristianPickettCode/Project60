const request = require('request');
const cheerio = require('cheerio');
const urlReq = require('url');

// Callback
exports.seriesSpecificShowSeasonScrape = (showName, url, cb) => {

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

    $("#left div[itemprop='season'] .lists a[itemprop='url']").each(function (i, elm) {

      title = $(this).text();
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      var pathName = urlPart.path.split("/" + showName + "/");
      var seasonName = pathName[1];

      //console.log(showName)

      var season = {
        title : title,
        link : link,
        seasonName : seasonName,
        showName : showName
      }
      arr.push(season);
      //console.log(title)

    });
    $("#right div[itemprop='season'] .lists a[itemprop='url']").each(function (i, elm) {

      title = $(this).text();
      link = $(this).attr('href');

      var urlPart = urlReq.parse(link, true);

      var pathName = urlPart.path.split("/" + showName + "/");
      var seasonName = pathName[1];

      //console.log(showName)

      var season = {
        title : title,
        link : link,
        seasonName : seasonName,
        showName : showName
      }
      arr.push(season);
      //console.log(title)

    });

    arr.reverse();

    let $list = "ok";

    let list = {
      url: $url,
      seriesShowSeasonlist: arr
    }

    // Repond with the final JSON
    //console.log("Scraped");
    cb(list)

  })

}
