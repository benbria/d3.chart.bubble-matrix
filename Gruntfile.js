'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        meta: {
            pkg: grunt.file.readJSON('package.json'),
            srcFiles: [
                'src/meta/intro.js',
                '.build/util.js',
                '.build/layer/*.js',
                '.build/bubble-matrix.js',
                'src/meta/outro.js'
            ],
            chartName: 'bubble-matrix'
        },
        watch: {
            scripts: {
                files: ['src/**/*.{js,ls}'],
                tasks: ['livescript', 'concat']
            },
            style: {
                files: ['src/style/**/*.styl'],
                tasks: ['stylus:style']
            },
            theme: {
                files: ['src/theme/**/*.styl'],
                tasks: ['stylus:theme']
            },
            livereload: {
                options: {livereload: true},
                files: ['dist/*.{js,css}']
            }
        },
        jshint: {
            options: {
                curly: true,
                undef: true
            },
            grunt: {
                options: {
                    node: true
                },
                files: {
                    src: ['Gruntfile.js']
                }
            }
        },
        livescript: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.ls',
                    dest: '.build',
                    ext: '.js'
                }]
            }
        },
        concat: {
            options: {
                banner: '/*! <%= meta.pkg.name %> v<%= meta.pkg.version %>' +
                        ' - <%= meta.pkg.license.type %> */\n'
            },
            dist: {
                files: {
                    'dist/d3.chart.<%= meta.chartName %>.js':
                        '<%= meta.srcFiles %>'
                }
            }
        },
        uglify: {
            options: {
                // Preserve banner
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'dist/d3.chart.<%= meta.chartName %>.min.js':
                        'dist/d3.chart.<%= meta.chartName %>.js'
                }
            }
        },
        stylus: {
            style: {
                files: {
                    'dist/d3.chart.<%= meta.chartName %>.css' :
                        ['src/style/**/*.styl']
                }
            },
            theme: {
                files: {
                    'dist/d3.chart.<%= meta.chartName %>.default.css' :
                        ['src/theme/**/*.styl']
                }
            }
        },
        copy: {
            bower: {
                files: [
                    {dest: 'dist/', src: ['bower.json']}
                ]
            }
        },
        connect: {
            options: {
                port: 8000,
                // Change to * to access from all networks.
                hostname: 'localhost'
            },
            dev: {
                options: {
                    base: ['bower_components', 'dist', 'example'],
                    directory: 'example',
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-livescript');

    grunt.registerTask('dist', [
        'jshint', 'livescript', 'concat', 'uglify', 'stylus', 'copy'
    ]);

    grunt.registerTask('dev', [
        'livescript', 'concat', 'stylus', 'connect', 'watch'
    ]);
    grunt.registerTask('default', 'dist');
};
