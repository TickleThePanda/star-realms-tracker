const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');

function html() {
  return src('src/view/*.html')
    .pipe(dest('site'));
}

function css() {
  return src('src/style/[^_]*.scss')
    .pipe(sass())
    .pipe(dest('site'));
}

function js() {
  return browserify({
      entries: 'src/ts/main.ts'
    })
    .plugin(tsify, { target: 'ES6' })
    .bundle()
    .pipe(source('main.js'))
    .pipe(dest('site'));
}

function images() {
  return src('src/images/*.{png,jpg,webp}')
    .pipe(dest('site/images'));
}

function watchFiles() {
  watch('./src/view/*.html', html);
  watch('./src/style/*.scss', css);
  watch('./src/ts/*.ts', js);
  watch('./src/images/*.{png,jpg,webp}', images);
}

exports.default = parallel(html, css, js, images);
exports.watch = watchFiles;
