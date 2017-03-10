/**
 * Created by liwenqian on 2017/3/10.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpsync = require('gulp-sync')(gulp);
var minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    revCollector = require('gulp-rev-collector');
//c清除文件夹避免荣誉
gulp.task("clean", function () {
    return gulp.src("dist", {read: false}).pipe(clean())
});


//对es6的转化
gulp.task('es6', function () {
    return gulp.src("modules/*")
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('dist'))
})

gulp.task('pack-js', function () {
    return gulp.src('dist/main.js')
        .pipe(browserify())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('bundle'))
})


gulp.task("compress-bundle", function () {
    return gulp.src('bundle/bundle.js')
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('bundle'));

});

gulp.task("css", function () {
    return gulp.src("app/styles/*.css")
        .pipe(minifyCss())
        .concat()
        .pipe(rev())
        .pipe(gulp.dest('dist/app/styles'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
});
gulp.task('js', function () {
    return gulp.src('app/scripts/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rev())
        .concat()
        .pipe(gulp.dest('dist/app/scripts/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'))
});
gulp.task("rev", function () {
    return gulp.src(['dist/rev/**/*.json', 'app/pages/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist/app/pages/'));
});
gulp.task('html', function () {
    return gulp.src('dist/app/pages/*.html')
        .pipe(useref())
        .pipe(rev())
        .pipe(revReplace())
        .pipe(gulp.dest('dist/html/'));
});
//build source files to released bundle file
gulp.task('build', gulpsync.sync(['compile-es6', 'pack-js', 'compress-bundle']), function () {
    if (process.argv.pop() == '--dev') {
        //watch any change and then re-run the tasks
        gulp.watch('modules/*', gulpsync.sync(['compile-es6', 'pack-js', 'compress-bundle']));
    }
});

//run a server listening at port 8000
gulp.task('server', function () {
    connect.server({
        root: 'app',
        port: 8000,
        livereload: true
    });
});