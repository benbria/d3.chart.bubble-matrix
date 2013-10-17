module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({
    meta: {
      pkg: grunt.file.readJSON("package.json"),
      srcFiles: [
        "src/intro.js",
        "build/bubble-matrix.js",
        "src/outro.js"
      ],
      chartName: 'bubble-matrix'
    },
    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["jshint"]
      },
      styles: {
        files: ["src/styles/**/*.styl"],
        tasks: ["stylus"]
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
          src: ["Gruntfile.js"]
        }
      }
    },
    livescript: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '*.ls',
          dest: '.build',
          ext: '.js'
        }]
      }
    },
    concat: {
      options: {
        banner: "/*! <%= meta.pkg.name %> v<%= meta.pkg.version %>" +
                " - <%= meta.pkg.license.type %> */\n"
      },
      dist: {
        files: {
          "dist/d3.chart.<%= meta.chartName %>.js": "<%= meta.srcFiles %>"
        }
      }
    },
    uglify: {
      options: {
        // Preserve banner
        preserveComments: "some"
      },
      dist: {
        files: {
          "dist/d3.chart.<%= meta.chartName %>.min.js": "dist/d3.chart.<%= meta.chartName %>.js"
        }
      }
    },
    stylus: {
      dist: {
        files: {
          "dist/d3.chart.<%= meta.chartName %>.css" : ["src/styles/**/*.styl"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks('grunt-livescript');

  grunt.registerTask("default", ["jshint", "livescript", "concat", "uglify", "stylus"]);
};
