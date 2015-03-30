/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          document: true,
          window: true,
          console: true,
          alert: true,
          Image: true,
          $: true,
          jQuery: true,
          imagesLoaded: true,
          setInterval: true,
          require: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      plugin: {
        src: ['src/*.js']
      }
    },
    
    browserify: {
      './dist/jquery.uniform_thumbnails.pkgd.js': ['./src/jquery.uniform_thumbnails.js']
    },
    
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/jquery.uniform_thumbnails.min.js': ['./dist/jquery.uniform_thumbnails.pkgd.js']//['bower_components/imagesloaded/imagesloaded.pkgd.js', 'src/jquery.uniform_thumbnails.js']
        }
      }
    },
    sass: {
      dist: {
        files: {
          'demo/style.css': 'demo/style.scss'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      jshint: {
        files: '<%= jshint.plugin.src %>',
        tasks: ['jshint:plugin']
      },
      uglify: {
        files: 'src/*.js',
        tasks: ['uglify']
      },
      sass: {
        files: 'demo/*.scss',
        tasks: ['sass']
      }
    }
  });
  
  // Load task plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify', 'sass']);
};