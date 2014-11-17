Gulp Aside
==========

[![Build Status](https://travis-ci.org/TakenPilot/gulp-aside.svg?branch=master)](https://travis-ci.org/TakenPilot/gulp-aside)

[![Code Climate](https://codeclimate.com/github/TakenPilot/gulp-aside/badges/gpa.svg)](https://codeclimate.com/github/TakenPilot/gulp-aside)

[![Coverage Status](https://img.shields.io/coveralls/TakenPilot/gulp-aside.svg)](https://coveralls.io/r/TakenPilot/gulp-aside?branch=master)

[![Dependencies](https://david-dm.org/TakenPilot/gulp-aside.svg?style=flat)](https://david-dm.org/TakenPilot/gulp-aside.svg?style=flat)

[![NPM version](https://badge.fury.io/js/gulp-aside.svg)](http://badge.fury.io/js/gulp-aside)

Apply only to files that match glob pattern.

```js
gulp.src('**/*.css')
  .pipe(aside('**/certain/*.css', rename({
    prefix: "certain-"
  })))
  .pipe(gulp.dest('public'));
```

```js
gulp.src('**/*.js')
  .pipe(aside('**/components/*.js', function (file, encoding, cb) {
    //replace groups of whitespace with a single-space
    var str = file.contents.toString().replace(/\w*/g, ' ');

    file.contents = new Buffer(str);
    cb(null, file);
  }))
  .pipe(gulp.dest('public'));
```