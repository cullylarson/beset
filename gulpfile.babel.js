import gulp from 'gulp'
import minimist from 'minimist'
import path from 'path'
import {taskCss} from './tasks/css'

const argv = minimist(process.argv.slice(2))

const settings = {
    // css
    cssGlob: 'css/**/*.css',
    cssEntry: path.join(__dirname, 'css', 'main.css'),
    cssDistDir: path.join(__dirname, 'build', 'css'),
}

const enabled = {
    // disable maps with --production
    maps: !argv.production,
}

gulp.task('css', taskCss(settings.cssEntry, settings.cssDistDir, enabled.maps))

gulp.task('watch', ['css'], () => {
    gulp.watch(settings.cssGlob, ['css'])
})

gulp.task('default', ['css'])
