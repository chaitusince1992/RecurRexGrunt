module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: '*.html',
                        dest: 'builds/development',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'src/img',
                        src: '**',
                        dest: 'builds/development/img',
                        filter: 'isFile'
                    }
                ]
            }
        },
        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'expanded'
                },
                files: { // Dictionary of files
                    'builds/development/style.css': 'src/scss/style.scss', // 'destination': 'source'
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3000,
                    base: {
                        path: 'builds/development/',
                        options: {
                            index: 'index.html'
                        }
                    },
                    livereload: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['copy']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['copy','sass', 'connect', 'watch']);
}
