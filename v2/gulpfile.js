'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var awspublish = require('gulp-awspublish');
var aws = require('./aws.json');

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
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./assets/js/dist/'));
  };

  return bundle();
});


gulp.task('publish', function() {

  // create a new publisher
  var publisher = awspublish.create({ key: aws.key,  secret: aws.secret, bucket: aws.bucket });

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