import gulp from 'gulp'
import minimist from 'minimist'
import path from 'path'
import {taskJs} from './tasks/javascript'
import {taskCss} from './tasks/css'

const argv = minimist(process.argv.slice(2))

const settings = {
    // general
    assetDistFolder: path.join(__dirname, 'build'),

    // js
    jsGlob: 'src/**/*.js',
    jsEntry: path.join(__dirname, 'src', 'main.js'),
    jsDistDir: path.join(__dirname, 'build', 'js'),
    jsDistFilename: 'app.js',

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
gulp.task('js', taskJs(settings.jsEntry, settings.jsDistDir, settings.jsDistFilename, enabled.maps))

gulp.task('watch', ['js', 'css'], () => {
    gulp.watch(settings.jsGlob, ['js'])
    gulp.watch(settings.csssGlob, ['css'])
})

gulp.task('default', ['js', 'css'])
