module.exports = function (grunt) {
    // Project configuration.
    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json'),
        clean: ['Content/Build/src', 'Content/Build/bin'],
        copy: {
            main: {
                src: 'Content/App/**',
                dest: 'Content/Build/src/',
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/define\(\[/g, "define('" + srcpath.replace(gruntConfig.copy.main.src.replace('\*\*', ''), '').replace(/.js$/g, '') + "', [");
                    },
                },
            },
            release: {
                src: 'Content/Build/bin/<%= pkg.name %>.min.js',
                dest: 'Content/<%= pkg.name %>.min.js'
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';\n'
            },
            dist: {
                // the files to concatenate
                src: [
                    '<%= copy.main.dest %>Content/App/**/*.js',
                    '!<%= copy.main.dest %>Content/App/boot.js',
                    '!<%= copy.main.dest %>Content/App/lib/angularjs/**',
                    '!<%= copy.main.dest %>Content/App/lib/angularjs/i18n/**',
                    '!<%= copy.main.dest %>Content/App/lib/CORS/**',
                    '!<%= copy.main.dest %>Content/App/lib/jQuery/**',
                    '!<%= copy.main.dest %>Content/App/lib/respond/**',
                    '!<%= copy.main.dest %>Content/App/lib/bootstrap.min.js',
                    '!<%= copy.main.dest %>Content/App/lib/zepto.min.js',
                    '!<%= copy.main.dest %>Content/App/lib/boot-cors.js'
                ],
                // the location of the resulting JS file
                dest: 'Content/Build/bin/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'Content/Build/bin/<%= pkg.name %>.min.js': ['<%= copy.main.dest %>Content/App/lib/requirejs.min.js', '<%= concat.dist.dest %>']
                }
            }
        }
    };
    grunt.initConfig(gruntConfig);
    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "copy" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Load the plugin that provides the "jshint" task.
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy:main', 'concat', 'uglify', 'copy:release'/*, 'jshint'*/]);
};