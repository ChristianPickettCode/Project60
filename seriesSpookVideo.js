var Spooky = require('spooky');

// Callback
exports.seriesSpookVidScrape = (url, cb) => {

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

      spooky.then(function() {
        var result = this.getElementAttribute(".push_button", 'href')
        this.emit('data', result)
      });

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
