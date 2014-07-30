var cache = require('./cache');
var shell = require('shelljs/global');

module.exports = {

  stdout: false,

  lint: function (file, cb) {
    var self = this;

    cache.has(file, function(err, isCached, hash) {
      if (err) return cb(err);

      if (isCached) {
        return cache.get(hash, function (err, cached) {
          if (self.stdout || cached.contents.indexOf("error:")>-1){
            process.stdout.write("Cache: "+cached.contents);
          }
          cb();
        });
      }

      exec('php -l ' + file, {silent: ! self.stdout}, function (code, output) {
        var err = (code === 0) ? null : output.trim();

        if (err) process.stdout.write("Lint: "+err+"\n");
        else {
          cache.put(hash, output, cb);
        }
    });
  }

};
