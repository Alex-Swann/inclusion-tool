'use strict';

const fs = require('fs');

/* eslint-disable func-names */
module.exports = function (grunt) {
  /* eslint-enable func-names */
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

  function nightwatchExtras() {
    return (grunt.option('tag') ? ` --tag ${grunt.option('tag')}` : '') + (grunt.option('chrome') ? ' -e chrome' : '');
  }

  grunt.initConfig({

    env: {
      local: {
        NODE_ENV: 'development'
      }
    },

    browserify: {
      'public/js/bundle.js': [
        'assets/js/**/*.js',
        'lib/utils/alternate-spellings.js'
      ]
    },

    clean: ['public'],

    copy: {
      govuk: {
        files: [
          {
            expand: true,
            cwd: './node_modules/govuk_frontend_toolkit/stylesheets',
            src: ['**'],
            dest: 'assets/scss/'
          },
          {
            expand: true,
            cwd: './node_modules/govuk-elements-sass/public/sass',
            src: ['**'],
            dest: 'assets/scss/'
          }
        ]
      },
      images: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'assets/images', src: ['**'], dest: 'public/images/'}
        ]
      }
    },

    /* eslint-disable camelcase */
    mocha_istanbul: {
      /* eslint-enable camelcase */
      all: {
        src: ['test'],
        options: {
          reportFormats: ['html', 'cobertura']
        }
      },
      integration: {
        src: ['test/integration'],
        options: {
          reportFormats: ['html', 'cobertura']
        }
      },
      unit: {
        src: ['test/_unit'],
        options: {
          reportFormats: ['html', 'cobertura']
        }
      }
    },

    sass: {
      public: {
        options: {
          style: 'expanded',
          loadPath: 'apps/assets/scss',
          precision: '5'
        },
        files: {
          'public/css/app.css': 'assets/scss/app.scss',
          'public/css/guide-app.css': 'assets/scss/guide-app.scss'
        }
      }
    },

    shell: {
      translations: {
        command: './node_modules/.bin/hof-transpiler ./apps/**/**/translations/src ./apps/**/translations/src -w ' +
        '--shared ./apps/common/translations/src'
      },
      integrationServiceStub: {
        command: './node_modules/.bin/dyson stubs 8886'
      }
    },

    /* eslint-disable no-process-env, max-len */
    exec: {
      nightwatchLocal: {
        cmd: './node_modules/.bin/nightwatch --skiptags integration --skiptags disabled' + nightwatchExtras()
      }
    },
    /* eslint-enable no-process-env, max-len */

    nodemon: {
      script: 'server.js',
      options: {
        ignore: [
          'govuk_modules/**',
          'node_modules/**',
          'coverage/**',
          'public/**',
          'cukes/**',
          'test/**',
          'acceptance_tests/**'
        ],
        args: grunt.option.flags(),
        ext: 'js,html',
        watch: [
          '.'
        ]
      }
    },

    watch: {
      scripts: {
        files: ['assets/js/**/*.js'],
        tasks: ['browserify']
      },
      css: {
        files: ['assets/scss/**/*.scss'],
        tasks: ['sass']
      },
      images: {
        files: ['assets/images/**'],
        tasks: ['copy:images']
      },
      translations: {
        files: ['apps/**/translations/src/**'],
        tasks: ['shell:translations']
      }
    },

    concurrent: {
      local: {
        tasks: [
          'nodemon',
          // 'shell:elasticMq',
          'watch'
        ],
        options: {
          logConcurrentOutput: true,
          limit: 5
        }
      }
    }

  });

  // Default task for Jenkins Job
  grunt.registerTask('default', [
    'transform'
  ]);

  // I'm very sorry
  grunt.registerTask('fixup', "Fixes messed up sass build step for heroku", function() {
    let filePath = "./node_modules/hmpo-frontend-toolkit/assets/stylesheets/mixins.scss";
    let contents = fs.readFileSync(filePath, {encoding: "utf8"});
    let matchedPath = contents.match(/\/tmp\/build_[^\/]*/);
    if (!matchedPath) {
      return;
    }
    contents = contents.split(matchedPath[0]).join("/app");
    fs.writeFileSync(filePath, contents, {encoding: "utf8"});
  });

  grunt.registerTask('default:local', [
    'transform'
  ]);

  // Runs a local server
  grunt.registerTask('local', [
    'env:local',
    'default:local',
    'concurrent:local'
  ]);

  grunt.registerTask('mocks', [
    'env:local'
  ]);

  // File transformation
  grunt.registerTask('transform', ['browserify', 'copy', 'fixup', 'sass', 'shell:translations']);

  // Testing
  grunt.registerTask('test', ['mocha_istanbul:all']);
  grunt.registerTask('test:integration', ['mocha_istanbul:integration']);
  grunt.registerTask('test:unit', ['mocha_istanbul:unit']);

  grunt.registerTask('test:acceptance', ['exec:nightwatchLocal']);
};
