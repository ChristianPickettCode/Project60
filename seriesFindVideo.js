var Spooky = require('spooky');

// Callback
exports.seriesSpookFindVidScrape = (url, cb) => {

  var spooky = new Spooky({
      child: {
          transport: 'http'
      },
      casper: {
          logLevel: 'debug',
          verbose: true
      }
  },function (err) {
      if (err) {
          e = new Error('Failed to initialize SpookyJS');
          e.details = err;
          throw e;
      }

      spooky.start();

      spooky.thenOpen(url);

      spooky.thenClick("#btn_download");

      spooky.then(function() {
        var result = this.getHTML("#player_code script[type='text/javascript']");
        result = result.split('sources:')[1]
        result = result.split('type:')[0]
        var matches = result.match(/\bhttps?:\/\/\S+/gi)[0];
        result = matches.replace("'", '').replace(",","")

        this.emit('data', result);
      });

      spooky.run();
  });

  spooky.on('error', function (e, stack) {
      console.error(e);
      console.log("error1")

      if (stack) {
        console.log("error2")
        console.log(stack);
      }
  });

  spooky.on('data', function(mess) {
    //console.log(mess)
    cb(mess);
  })

}
