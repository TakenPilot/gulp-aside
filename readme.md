Gulp Aside
----------

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