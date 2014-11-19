var through = require('through2'),
  minimatch = require('minimatch');

function isStream(obj) {
  return !!obj && typeof obj.pipe === 'function';
}

function forward(parentStream, childStream, streams, file, encoding, cb) {
  var index = streams.indexOf(childStream);
  if (index === -1) {
    childStream.on('data', function (file) {
      if (file) {
        parentStream.push(file);
      }
    });
    childStream.on('error', function (err) {
      parentStream.emit('error', err);
    });
    childStream.on('readable', function() {
      var file = childStream.read();
      if (file) {
        parentStream.push(file);
      }
    });
    streams.push(childStream);
  }
  childStream.write(file, encoding);
  cb();
}

module.exports = function (fileglob, obj) {
  var streams = [];
  return through.obj(function (file, encoding, cb) {
    var self = this;
    if (minimatch(file.path, fileglob)) {
      if (typeof obj === 'function') {
        obj.call(this, file, encoding, cb);
      } else if (isStream(obj)) {
        forward(self, obj, streams, file, encoding, cb);
      } else {
        cb(null, file);
      }
    } else {
      cb(null, file);
    }
  }, function (cb) {
    var i = 0;
    if (streams.length) {
      streams.forEach(function (childStream) {
        childStream.on('end', function () {
          i++;
          if (i === streams.length) {
            cb();
          }
        });
        childStream.end();
      });
    } else {
      cb();
    }
  });
};