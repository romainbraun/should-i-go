/*globals require */
(function () {
  'use strict';

  var browserify    = require('browserify'),
      gulp          = require('gulp'),
      source        = require('vinyl-source-stream'),
      buffer        = require('vinyl-buffer'),
      uglify        = require('gulp-uglify'),
      sourcemaps    = require('gulp-sourcemaps'),
      awspublish    = require('gulp-awspublish'),
      aws           = require('./aws.json'),
      watch         = require('gulp-watch'),
      minifyCSS     = require('gulp-minify-css'),
      autoprefixer  = require('gulp-autoprefixer'),
      size          = require('gulp-filesize'),
      mocha         = require('gulp-mocha'),
      lcov          = require('mocha-lcov-reporter'),
      notify        = require("gulp-notify"),
      tap           = require("gulp-tap"),
      istanbul      = require("gulp-istanbul"),
      fs            = require('fs');

  // var aws = JSON.parse(awsInfos);

  var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
  };

  gulp.task('javascript', function() {

    var bundler = browserify({
      entries: ['./assets/js/app.js'],
      debug: true
    });

    var bundle = function() {
      return bundler
        .bundle()
        .pipe(source(getBundleName() + '.js'))
        .pipe(buffer())
        .pipe(size())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(size())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/js/dist/'))
        .pipe(notify({
          "title": "Should I Go?",
          "subtitle": "Gulp Process",
          "message": '<%= file.relative %> was successfully minified!',
          "sound": "Pop", // case sensitive
          // "icon": path.join(__dirname, "gulp.png"), // case sensitive
          "onLast": true,
          // "wait": true
      }));
    };

    return bundle();
  });

  gulp.task('css', function() {
    gulp.src('./assets/css/main.css')
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(minifyCSS({keepSpecialComments: 0, relativeTo: './assets/css/', processImport: true}))
      .pipe(gulp.dest('./assets/css/dist/'))
      .pipe(notify({
          "title": "Should I Go?",
          "subtitle": "Gulp Process",
          "message": '<%= file.relative %> was successfully minified!',
          "sound": "Pop", // case sensitive
          // "icon": path.join(__dirname, "gulp.png"), // case sensitive
          "onLast": true,
          // "wait": true
      }));
  });

  gulp.task('watch', function () {
      watch('./assets/js/*.js', function (files, cb) {
          gulp.start('javascript', cb);
      });
      watch('./assets/css/*.css', function (files, cb) {
          gulp.start('css', cb);
      });
  });

  gulp.task('test', function () {
    return gulp.src('./assets/**/js/*.js')
      .pipe(istanbul())
      // .pipe(tap(function(f) {
      //   require(f.path);
      // }))
      .on('finish', function () {
        gulp.src('./assets/js/test/test.js')
          .pipe(mocha({reporter: 'spec'}))
          .pipe(istanbul.writeReports({
            dir: './assets/unit-test-coverage',
            reporters: [ 'lcov' ],
            reportOpts: { dir: './assets/unit-test-coverage'}
          }));
      });
        // .pipe(mocha({reporter: 'mocha-lcov-reporter'}))
        // .pipe(test);
        // .pipe(gulp.dest('./assets/js/test/test.lcov'));
});


  gulp.task('publish', function() {

    // create a new publisher
    var publisher = awspublish.create({ key: aws.key,  secret: aws.secret, bucket: aws.bucket, endpoint: aws.endpoint, region: aws.region });

    // define custom headers
    var headers = {
       'Cache-Control': 'max-age=315360000, no-transform, public'
       // ...
     };

    return gulp.src('./assets/js/dist/*.js')

       // gzip, Set Content-Encoding headers and add .gz extension
      .pipe(awspublish.gzip({ ext: '.gz' }))

      // publisher will add Content-Length, Content-Type and  headers specified above
      // If not specified it will set x-amz-acl to public-read by default
      .pipe(publisher.publish(headers))

      // create a cache file to speed up consecutive uploads
      .pipe(publisher.cache())

       // print upload updates to console
      .pipe(awspublish.reporter());
  });
})();