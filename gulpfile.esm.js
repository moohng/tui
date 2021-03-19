import { src, dest, parallel } from 'gulp';

import sass from 'gulp-sass';
import postCSS from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';

export function css_lib(cb) {
  src(['packages/**/style/*.scss'], {
    base: 'packages',
  })
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(postCSS([autoprefixer()]))
    .pipe(dest('lib'));

  cb();
}

export function css_dist(cb) {
  src(['packages/style/*.scss'])
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(postCSS([autoprefixer()]))
    .pipe(rename((path) => {
      if (path.basename === 'index') {
        path.basename = 'tui';
      }
      path.extname = '.min.css';
      return path;
    }))
    .pipe(dest('dist'))

  cb();
}

export const css = parallel(css_lib, css_dist);
