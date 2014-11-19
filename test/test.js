var aside = require('../.'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  gulp = require('gulp'),
  gUtil = require('gulp-util'),
  through = require('through2'),
  buffer = require('vinyl-buffer'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat');

/**
 * Each calls .on('data', function() {}), which turn the pipe into 'streaming' data (as much as Vinyl can be streaming).
 */
describe('streams', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });


  it('can pass through all files', function (done) {
    var spy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .on('data', spy)
      .pipe(aside('**/*'))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(spy.callCount).to.equal(6);
        done();
      }));
  });

  it('can call function on all files', function (done) {
    var spy = sandbox.spy(),
      asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .on('data', spy)
      .pipe(aside('**/*', function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(spy.callCount).to.equal(6);
        expect(asideSpy.callCount).to.equal(6);
        done();
      }));
  });

  it('can call function on subset', function (done) {
    var spy = sandbox.spy(),
      asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .on('data', spy)
      .pipe(aside('**/*.js', function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(spy.callCount).to.equal(6);
        expect(asideSpy.callCount).to.equal(2);
        done();
      }));
  });

  it('can handle transform on subset', function (done) {
    var spy = sandbox.spy(),
      asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .on('data', spy)
      .pipe(aside('**/*.js', through.obj(function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      })))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(spy.callCount).to.equal(6);
        expect(asideSpy.callCount).to.equal(2);
        done();
      }));
  });
});

/**
 * Each calls .pipe(buffer()), which turn the pipe into buffered data.
 */
describe('buffers', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });


  it('can pass through all files', function (done) {

    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*'))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        done();
      }));
  });

  it('can call function on all files', function (done) {
    var asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*', function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(asideSpy.callCount).to.equal(6);
        done();
      }));
  });

  it('can call function on subset', function (done) {
    var asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*.js', function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(asideSpy.callCount).to.equal(2);
        done();
      }));
  });

  it('can handle transform on subset', function (done) {
    var asideSpy = sandbox.spy();

    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*.js', through.obj(function (file, encoding, cb){
        asideSpy(arguments);
        cb(null, file);
      })))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        expect(asideSpy.callCount).to.equal(2);
        done();
      }));
  });
});

describe('bad data', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  it('bad second parameter type does not fail', function (done) {

    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*.txt', {}))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(6);
        done();
      }));
  });


  it('can handle transform with returned error on subset', function (done) {
    gulp.src('test/fixtures/**/*')
      .pipe(buffer())
      .pipe(aside('**/*.js', through.obj(function (file, encoding, cb){
        cb(new gUtil.PluginError('test plugin', 'test error'));
      }))).on('error', function (err) {
        expect(err.message).to.equal('test error');
        expect(err.plugin).to.equal('test plugin');
        done();
      })
      .pipe(gUtil.buffer(function (err, files) {
        done(new Error('Should have caused error'));
      }));
  });
});

describe('correct result', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  it('Correctly uses rename plugin', function (done) {
    gulp.src('test/fixtures/**/*')
      .pipe(aside('**/*.js', rename({
        prefix: "js-"
      })))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files[0].relative).to.equal('js-simpleJavaScript1.js');
        expect(files[1].relative).to.equal('js-simpleJavaScript2.js');
        expect(files[2].relative).to.equal('simpleStylesheet1.css');
        expect(files[3].relative).to.equal('simpleStylesheet2.css');
        expect(files[4].relative).to.equal('simpleText1.txt');
        expect(files[5].relative).to.equal('simpleText2.txt');
        done();
      }));
  });

  it('Correctly uses concat plugin', function (done) {
    gulp.src('test/fixtures/**/*')
      .pipe(aside('**/*.js', concat('test.js')))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files[0].relative).to.equal('simpleStylesheet1.css');
        expect(files[1].relative).to.equal('simpleStylesheet2.css');
        expect(files[2].relative).to.equal('simpleText1.txt');
        expect(files[3].relative).to.equal('simpleText2.txt');
        expect(files[4].relative).to.equal('test.js');
        done();
      }));
  });

  it('Correctly uses multiple plugins', function (done) {
    gulp.src('test/fixtures/**/*')
      .pipe(aside('**/*.js', concat('test.js')))
      .pipe(aside('**/*.css', rename({
        prefix: 'css-'
      })))
      .pipe(aside('**/css-*.css', concat('test.css')))
      .pipe(aside('**/test.*', rename({
        prefix: 'found-'
      })))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files[0].relative).to.equal('simpleText1.txt');
        expect(files[1].relative).to.equal('simpleText2.txt');
        expect(files[2].relative).to.equal('found-test.js');
        expect(files[3].relative).to.equal('found-test.css');
        expect(files[2].contents.toString()).to.contain('first').and.contain('second');
        expect(files[3].contents.toString()).to.contain('first').and.contain('second');
        done();
      }));
  });
});