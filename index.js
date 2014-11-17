var through = require('through2'),
  minimatch = require('minimatch');

function isTransform(obj) {
  return !!obj && typeof obj._transform === 'function';
}

module.exports = function (fileglob, obj) {
  return through.obj(function (file, encoding, cb) {
    if (minimatch(file.path, fileglob)) {
      if (typeof obj === 'function') {
        obj.call(this, file, encoding, cb);
      } else if (isTransform(obj)) {
        obj._transform.apply(obj, Array.prototype.slice.call(arguments, 0));
      } else {
        cb(null, file);
      }
    } else {
      cb(null, file);
    }
  });
};