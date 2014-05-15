module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      plugin: {
        src: ['src/js/*.js']
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'build/jquery.bs_imagify.min.js': 'src/js/jquery.bs_imagify.js'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      jshint: {
        files: '<%= jshint.assets.src %>',
        tasks: ['jshint:plugin']
      },
      uglify: {
        files: 'src/js/*.js',
        tasks: ['uglify']
      }
    }
  });
  
  // Load task plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify']);
};