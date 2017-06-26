var Spooky = require('spooky');

// Callback
exports.spookVidScrape = (url, cb) => {

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

      spooky.thenClick("#r-reklam button");

      spooky.then(function() {
        var string = this.getHTML('script[type="text/javascript"]')
        var matches = string.match(/\bhttps?:\/\/\S+/gi);
        var result = matches[1].replace('"', '').replace(",","")
        this.emit('data', result)
      })

      spooky.run();
  });

  spooky.on('error', function (e, stack) {
      console.error(e);

      if (stack) {
          console.log(stack);
      }
  });

  spooky.on('data', function(mess) {
    //console.log(mess)
    cb(mess);
  })

}
