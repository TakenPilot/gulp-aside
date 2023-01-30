Gulp Aside
==========

> **⚠ Warning**
> This library is deprecated. The underlying libraries that this package relies on are either unmaintained or have security warnings. I'm deprecating this project until someone rewrites it with modern tooling.

Apply transform only to files that match glob pattern.

Works with any other gulp plugin, as well as inline transform functions.

##Apply other gulp plugins to certain files

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

Example of concatenating files with the word `inline` into the new file `inline.css`:
```js
var aside = require('gulp-aside'),
  concat = require('gulp-concat');

gulp.src('**/*.css')
  .pipe(aside('**/*.inline.*.css', concat('inline.css')))
  .pipe(gulp.dest('public'));
```

##Apply inline transform function to certain files

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