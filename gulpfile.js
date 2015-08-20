var gulp = require("gulp");
var browserify = require("browserify");
var babel = require("babelify");
var source = require("vinyl-source-stream");

gulp.task("compile-javascript", function () {
  var bundler = browserify("./src/main.jsx", {debug: true}).transform(babel);

  return bundler
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("copy-static", function() {
  return gulp
    .src("static/**")
    .pipe(gulp.dest("dist"));
});

gulp.task("default", ["compile-javascript", "copy-static"]);
