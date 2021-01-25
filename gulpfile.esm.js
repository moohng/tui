import { src, dest } from 'gulp';
import sass from 'gulp-sass';
import postCSS from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

export function css(cb) {
  src(['src/components/**/style/*scss'], {
    base: 'src/components',
  })
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(postCSS([autoprefixer()]))
    .pipe(dest('lib'));

  cb();
}
