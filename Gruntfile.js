'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        meta: {
            pkg: grunt.file.readJSON('package.json'),
            srcFiles: [
                'src/meta/intro.js',
                '.build/util.js',
                '.build/layer/*.js',
                '.build/chart.js',
                'src/meta/outro.js'
            ],
            chartName: 'bubble-matrix',
            chartJSName: 'd3ChartBubbleMatrix'
        },
        watch: {
            scripts: {
                files: ['src/**/*.{js,coffee}'],
                tasks: ['coffee', 'concat']
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
                files: ['dist/*.{js,css}', 'example/**/*.{html,js,css}']
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
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.coffee',
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
        },
        karma: {
            // TODO(undashes): add test coverage. Last time I tried with plugin
            // karma-coverage, it was doing nothing visible...
            options: {
                basePath: '.',
                reporters: 'progress',
                frameworks: ['mocha', 'sinon-chai'],
                files: [
                    'bower_components/d3/d3.js',
                    'bower_components/d3.chart/d3.chart.js',
                    'bower_components/d3.chart.base/d3.chart.base.js',
                    'bower_components/lodash/dist/lodash.js',
                    'dist/d3.chart.<%= meta.chartName %>.{css,js,default.css}',
                    'test/data.js',
                    'test/*.spec.js'
                ],
                port: 9876,
                captureTimeout: 20000,
                reportSlowerThan: 500
            },
            ci: {
                // XXX(jeanlauliac): does not work with PhantomJS because
                // Function.prototype.bind is not implemented. See
                // https://github.com/ariya/phantomjs/issues/10522
                browsers: ['Firefox'],
                singleRun: true
            },
            dev: {
                browsers: ['Chrome', 'Firefox'],
                autoWatch: true
                // background: true,
            }
        }
    });

    grunt.registerTask('build', [
        'coffee', 'concat', 'stylus'
    ]);

    grunt.registerTask('dist', [
        'jshint', 'build', 'uglify', 'copy'
    ]);

    grunt.registerTask('dev', [
        'build', 'connect', 'watch'
    ]);

    grunt.registerTask('default', 'dist');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');
};
