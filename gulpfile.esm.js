import { src, dest, series, parallel } from 'gulp';
import del from 'del';

import sass from 'gulp-sass';
import postCSS from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

import babel from 'gulp-babel';

export function css(cb) {
  src(['packages/**/style/*scss'], {
    base: 'packages',
  })
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(postCSS([autoprefixer()]))
    .pipe(dest('lib'));

  cb();
}

export function js(cb) {
  src(['packages/**/*.ts', 'packages/**/*.tsx'], {
    base: 'packages',
  })
    .pipe(babel())
    .pipe(dest('lib'));

  cb();
}

export function clean() {
  return del(['lib']);
}

export const build = series(clean, parallel(js, css));
