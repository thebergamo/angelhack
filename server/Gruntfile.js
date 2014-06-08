module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            site: {
                src: './public/js/bundle.js',
                dest: './public/js/bundle.min.js'
            }
        },
        browserify: {
            site: {
                files: {
                    './public/js/bundle.js': ['./public/js/app.js']
                }
            }
        },
        watch: {
            site: {
                files: ['./public/js/**/*.js', '!./public/js/bundle.js', '!./public/js/bundle.min.js'],
                tasks: ['browserify:site']
            },
            all: {
                files: ['./public/**', './template/**'],
                tasks: [],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

};
