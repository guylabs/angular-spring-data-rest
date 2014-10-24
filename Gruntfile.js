'use strict';

module.exports = function (grunt) {

    // load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // add time used for tasks statistics
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        "bower-install-simple": {
            options: {
                color: true
            },
            dev: {
                options: {
                    production: false
                }
            }
        },
        concat: {
            options: {
                banner: "(function() {\n\n'use strict';\n\n",
                footer: '\n})();',
                separator: '\n',
                process: true
            },
            dist: {
                src: [
                    'src/angular-spring-data-rest-module.js',
                    'src/angular-spring-data-rest-provider.js',
                    'src/angular-spring-data-rest-interceptor-provider.js',
                    'src/angular-spring-data-rest-utils.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: "/*!\n * <%= pkg.name %> <%= pkg.version %>\n * Copyright <%= grunt.template.today('yyyy') %> Guy Brûlé (@guy_labs)\n * https://github.com/guylabs/angular-spring-data-rest\n */\n"
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('build', ['bower-install-simple:dev', 'karma:continuous', 'concat', 'uglify']);
    grunt.registerTask('test', ['karma:continuous']);
    grunt.registerTask('default', [ 'build' ]);

};
