var aside = require('../.'),
  expect = require('chai').expect,
  sinon = require('sinon'),
  gulp = require('gulp'),
  gUtil = require('gulp-util'),
  through = require('through2'),
  buffer = require('vinyl-buffer');

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
      .pipe(gUtil.buffer(function () {
        done(new Error('Should have caused error'));
      }));
  });
});