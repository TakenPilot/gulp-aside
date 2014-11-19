Gulp Aside
==========

[![Build Status](https://travis-ci.org/TakenPilot/gulp-aside.svg?branch=master)](https://travis-ci.org/TakenPilot/gulp-aside)

[![Code Climate](https://codeclimate.com/github/TakenPilot/gulp-aside/badges/gpa.svg)](https://codeclimate.com/github/TakenPilot/gulp-aside)

[![Coverage Status](https://img.shields.io/coveralls/TakenPilot/gulp-aside.svg)](https://coveralls.io/r/TakenPilot/gulp-aside?branch=master)

[![Dependencies](https://david-dm.org/TakenPilot/gulp-aside.svg?style=flat)](https://david-dm.org/TakenPilot/gulp-aside.svg?style=flat)

[![NPM version](https://badge.fury.io/js/gulp-aside.svg)](http://badge.fury.io/js/gulp-aside)

Apply transform only to files that match glob pattern.

Works with any other gulp plugin, as well as inline transform functions.

##Apply other gulp plugins to certain files.

Example of renaming stylesheets in a particular folder:
```js
var aside = require('gulp-aside'),
  rename = require('gulp-rename');

gulp.src('**/*.css')
  .pipe(aside('**/certain/*.css', rename({
    prefix: "certain-"
  })))
  .pipe(gulp.dest('public'));
```

Example of concatenating files with the word `inline`:
```js
var aside = require('gulp-aside'),
  concat = require('gulp-concat');

gulp.src('**/*.css')
  .pipe(aside('**/*.inline.*.css', concat('inline.css')))
  .pipe(gulp.dest('public'));
```

##Apply transform function to certain files.

Example of replacing groups of whitespace with a single-space, but only in javascript files in a component folder
```js
var aside = require('gulp-aside');

gulp.src('**/*.js')
  .pipe(aside('**/components/*.js', function (file, encoding, cb) {
    var str = file.contents.toString().replace(/\w*/g, ' ');

    file.contents = new Buffer(str);
    cb(null, file);
  }))
  .pipe(gulp.dest('public'));
```

##Install

```Sh
npm install --save-dev gulp-aside
```

##Running Tests

To run the basic tests, just run `mocha` normally.

This assumes you've already installed the local npm packages with `npm install`.