'use strict';

import del from 'del';
import server from 'express';
import gulp from 'gulp';
//import gulpLiveServer from 'gulp-live-server';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';

const $ = gulpLoadPlugins();

const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'edge >= 20',
  'ff >= 44',
  'chrome >= 48',
  'safari >= 8',
  'opera >= 35',
  'ios >= 8'
];

const dirs = {
  src: 'public',
  dest: 'build',
  build: 'build',
  css: 'build/css'
}

const SERVER_DIRS = {
  css: 'public/stylesheets/css'
}

const sassPaths = {
  src: 'public/stylesheets'
}

gulp.task('copy-css', () => {
  return gulp.src([
    'node_modules/flexboxgrid/dist/**/*'
  ])
  .pipe(gulp.dest(SERVER_DIRS.css))
});

// Compile styles
gulp.task('styles', ['copy-css'], () => {
  return gulp.src('public/stylesheets/scss/**/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(dirs.css));
});

gulp.task('clean', () => del(['build']));

gulp.task('serve', () => {
  $.connect.server({
    root: 'build',
    port: 3000,
    livereload: true
  });

  gulp.src('build/index.html')
    .pipe($.open({uri: 'http://localhost:3000'}));
});

// gulp.task('serve', () => {
//   let server = gulpLiveServer('app.js');
//   server.start();
// });

gulp.task('html', () => {
  return gulp.src([
    'public/**/*'
  ])
  .pipe(gulp.dest('build'));
});

gulp.task('go', ['clean', 'styles', 'serve'], () => {

});

// gulp.task('default', () => {
//   return gulp.src('src/app.js')
//     .pipe(babel({
//       presets: ['es2015']
//     }))
//     .pipe(gulp.dest('dist'))
// });
