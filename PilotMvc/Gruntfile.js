module.exports = function (grunt) {
    String.prototype.replaceAll = function (matches, newVal, mustPerform) {
        var str = this.toString();
        while ((mustPerform === undefined || !!mustPerform) && str.indexOf(matches) > -1) {
            str = str.replace(matches, newVal);
        }
        return str;
    };
    // Project configuration.
    /// Content/dist/release/App Content/src/Template/js/main.js
    var $base = {
        url: {
            debug: 'http://localhost:51949',
            release: 'http://mojomanagement.mediaonesupport.com',
            key: '$base.url'
        },
        app: {
            root: '/App',
            dest: function () { return $base.dest.root + $base.app.root; },
            destKey: '$base.app.dest',
            src: function () {
                return $base.src.root + $base.app.root;
            },
            srcKey: '$base.src'
        },
        src: {
            root: 'Content/src'
        },
        dest: {
            root: 'Content/dist/release',
            key: '$base.dest.root'
        },
        pre: {
            root: 'Content/dist/pre-compiled'
        },
        layout: {
            getUnique: function (srcs) {
                var files = {};
                files[$base.dest.root + '/' + $base.layout.unique] = srcs;
                return files;
            },
            lazy: 'App/lib/requirejs.min.js',
            unique: 'main.js',
            key: '$base.layout'
        }
    }, $uglifyMultiple = {
        files: {}
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            start: ['/Views/Shared/**/*.*', 'Content/dist/debug/**/*.*', $base.dest.root + '/**/*.*', $base.pre.root + '/**/*.*'],
            end: ['Content/dist/debug/**/*.*', 'Content/dist/debug'/*, $base.pre.root + '/** /*.*', $base.pre.root*/]
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    '$': true
                },
            },
            all: {
                files: {
                    src: [$base.src.root + '/**/*.js']
                }
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 7,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,                           // Enable dynamic expansion
                    cwd: $base.src.root,                    // Src matches are relative to this path
                    src: ['**/*.{png,jpg,jpeg,gif}'],       // Actual patterns to match
                    dest: $base.pre.root                    // Destination path prefix
                }]
            }
        },
        copy: {
            templatelazy: {
                expand: true,
                cwd: 'Views/_Shared/',
                src: ['Layout.cshtml'],
                dest: 'Views/Shared/',
                options: {
                    process: function (content, srcpath) {
                        //console.log(srcpath);
                        return content.replaceAll($base.layout.key, $base.layout.lazy)
                                .replaceAll($base.dest.key, $base.dest.root)
                                .replaceAll($base.app.destKey, $base.app.dest());
                    }
                }
            },
            templateunique: {
                expand: true,
                cwd: 'Views/_Shared/',
                src: ['Layout.cshtml'],
                dest: 'Views/Shared/',
                options: {
                    process: function (content, srcpath) {
                        //console.log(srcpath);
                        return content.replaceAll($base.layout.key, $base.layout.unique)
                                .replaceAll($base.dest.key, $base.dest.root)
                                .replaceAll($base.app.destKey, $base.app.dest());
                    }
                }
            },
            app: {
                expand: true,
                cwd: $base.src.root,
                src: ['**/*.*', '!**/*.{png,jpg,jpeg,gif}', '!Template/**/*.{js,html}'],
                dest: $base.pre.root,
                options: {
                    process: function (content, srcpath) {
                        //console.log(srcpath);
                        //console.log(arguments.length);
                        if ((/\.(png|jpg|jpeg|gif)$/g).test(srcpath)) {
                            return content;
                        }
                        var relPath = srcpath.replaceAll($base.app.src(), '');
                        if ((/\.js$/g).test(relPath)) {
                            $uglifyMultiple.files[$base.app.dest() + relPath] = ['<%= copy.app.dest %>' + $base.app.root + relPath];
                            if (relPath.length > 0 && relPath[0] === '/') {
                                relPath = relPath.substring(1);
                            }
                            content = content.replace(/define\(\[/g, "define('" + relPath.replace(/.js$/g, '') + "', [");
                        }
                        if ((/\.(js|html|css)$/g).test(relPath)) {
                            content = content.replaceAll($base.url.key, $base.url.debug)
                                .replaceAll($base.dest.key, $base.dest.root)
                                .replaceAll($base.app.destKey, $base.app.dest());
                        }
                        return content;
                    }
                }
            },
            font: {
                expand: true,
                cwd: $base.pre.root,
                src: ['Fonts/**/*.*'],
                dest: $base.dest.root
            },
            images: {
                expand: true,
                cwd: $base.pre.root,
                src: ['**/*.{png,jpg,jpeg,gif}'],
                dest: $base.dest.root
            },
            css: {
                expand: true,
                cwd: $base.pre.root,
                src: ['**/*.css'],
                dest: $base.dest.root
            },
            html: {
                expand: true,
                cwd: $base.pre.root,
                src: ['App/**/*.html'],
                dest: $base.dest.root
            },
            multiple: {
                expand: true,
                cwd: $base.pre.root,
                src: ['App/**/*.js'],
                dest: $base.dest.root
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';\n'
            },
            release: {
                // the files to concatenate
                src: [
                    '<%= copy.app.dest %>/App/**/*.js',
                    //'!<%= copy.app.dest %>boot.js',
                    '!<%= copy.app.dest %>/App/lib/angularjs/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/angularjs/i18n/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/CORS/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/jQuery/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/respond/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/froala/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/fingerprintjs/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/xml/**/*.*',
                    '!<%= copy.app.dest %>/App/lib/bootstrap.min.js',
                    '!<%= copy.app.dest %>/App/lib/zepto.min.js',
                    '!<%= copy.app.dest %>/App/lib/json3.js',
                    '!<%= copy.app.dest %>/App/lib/modernizr.min.js',
                    '!<%= copy.app.dest %>/App/lib/cors-require.min.js',
                    '!<%= copy.app.dest %>/App/lib/requirejs.min.js',
                    '!<%= copy.app.dest %>/App/routesDefinitionDeferred.js'
                    //'!<%= copy.app.dest %>lib/bootCors.js'
                ],
                // the location of the resulting JS file
                dest: '<%= copy.app.dest %>/main.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            multiple: $uglifyMultiple,
            unique: {
                files: $base.layout.getUnique(['<%= copy.app.dest %>/App/lib/requirejs.min.js', '<%= concat.release.dest %>'])
            }
        }
    });
    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "imagemin" task.
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    // Load the plugin that provides the "copy" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // DEBUG LAZY task(s).
    grunt.registerTask('DEBUG', ['clean:start', 'copy:app', 'copy:templatelazy', 'copy:html', 'copy:font', 'imagemin', 'copy:images', 'copy:css', 'copy:multiple', 'clean:end']);

    // RELEASE LAZY task(s).
    grunt.registerTask('RELEASE', ['clean:start', 'copy:app', 'copy:templatelazy', 'copy:html', 'copy:font', 'imagemin', 'copy:images', 'copy:css', 'uglify:multiple', 'clean:end']);

    // RELEASE BATCH task(s).
    grunt.registerTask('RELEASEBATCH', ['clean:start', 'copy:app', 'copy:templateunique', 'copy:html', 'copy:font', 'imagemin', 'copy:images', 'copy:css', 'uglify:multiple', 'concat:release', 'uglify:unique', 'clean:end']);

    // RELEASE DEPLOY task(s).
    grunt.registerTask('DEPLOY', ['clean:start', 'copy:app', 'copy:templatelazy', 'copy:html', 'copy:font', 'imagemin', 'copy:images', 'copy:css', 'uglify:multiple', 'clean:end']);
};