const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const replace = require('gulp-replace');

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
  const files = [
    { srcFile: 'src/ts/main.ts', destFile: 'main.js' },
    { srcFile: 'src/ts/register-sw.ts', destFile: 'register-sw.js' }
  ];

  const tasks = files.map(file => {
    return browserify({entries: file.srcFile})
      .plugin(tsify, { target: 'ES6' })
      .bundle()
      .pipe(source(file.destFile))
      .pipe(dest('site'));
  });

  return Promise.all(tasks);
}

function sw() {
  return src('src/sw/sw.js')
    .pipe(replace('///version///', Date.now()))
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
  watch('./src/sw/sw.js', sw);
  watch('./src/images/*.{png,jpg,webp}', images);
}

exports.default = parallel(html, css, js, sw, images);
exports.watch = watchFiles;
