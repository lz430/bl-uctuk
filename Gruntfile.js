module.exports = function(grunt) {
    var jsonFiles = ['theme.json', 'theme-ui.json', 'package.json', 'labels/*.json'], 
        jsFiles = ['Gruntfile.js', 'build.js', 'scripts/**/*.js'], 
        filesToArchive = ['admin/**', 'compiled/**', 'labels/**', 'resources/**', 'scripts/**', 'stylesheets/**', 'templates/**', 'build.js', 'CHANGELOG.md', 'Gruntfile.js', 'LICENSE', 'package.json', 'README.md', 'theme.json', 'theme-ui.json', '*.ico', '*.png'], 
        versionCmd = ':';

    // e.g. 'git describe --tags --always' or 'svn info'
    grunt.initConfig({
        bower : {
            install : {
                options : {
                    targetDir : './scripts/vendor',
                    layout : 'byComponent',
                    cleanBowerDir : true,
                    bowerOptions : {
                        production : true,
                        forceLatest : true
                    }
                }
            }
        },
        pkg : grunt.file.readJSON('package.json'),
        jsonlint : {
            theme_json : {
                src : jsonFiles
            }
        },
        jshint : {
            theme_js : jsFiles,
            options : {
                ignores : ['build.js', 'scripts/*.js', 'scripts/vendor/**/*.js'],
                undef : true,
                laxcomma : true,
                unused : false,
                "-W099" : true,
                globals : {
                    jQuery : false,
                    console : true,
                    window : true,
                    document : true,
                    event : false,
                    navigator : false,
                    top : false,
                    setTimeout : true,
                    clearTimeout : true,
                    module : true,
                    define : true,
                    require : true,
                    Modernizr : true,
                    process : true
                }
            }
        },
        zubat : {
            main : {
                dir : '.',
                manualancestry : null,
                ignore : ['\\references', '\\.git', 'node_modules', '^/resources', '^/tasks', '\\.zip$']
            }
        },
        compress : {
            build : {
                options : {
                    archive : '<%= pkg.name %>.zip',
                    pretty : true
                },
                files : [{
                    src : filesToArchive,
                    dest : '/'
                }]
            }
        },
        setver : {
            release : {
                cmd : versionCmd,
                themejson : true,
                packagejson : true,
                bowerjson : true,
                thumbnail : {
                    src : 'thumb.tpt.png',
                    color : '#adc270',
                    pointsize : 34,
                    dest : 'thumb.png'
                }
            },
            build : {
                cmd : versionCmd,
                themejson : true,
                packagejson : true,
                thumbnail : {
                    src : 'thumb.tpt.png',
                    color : '#bed381',
                    pointsize : 16,
                    dest : 'thumb.png'
                }
            },
            renamezip : {
                cmd : versionCmd,
                filenames : ["<%= pkg.name %>.zip"]
            }
        },
        watch : {
            json : {
                files : jsonFiles,
                tasks : ['jsonlint'],
                options : {
                    spawn : false
                }
            },
            javascript : {
                files : jsFiles,
                tasks : ['jshint'],
                options : {
                    spawn : false
                }
            },
            compress : {
                files : filesToArchive,
                tasks : ['compress']
            }
        }
    });
    ['grunt-bower-task', 'grunt-contrib-jshint', 'grunt-contrib-watch', 'grunt-contrib-compress'].forEach(grunt.loadNpmTasks);
    grunt.loadTasks('./tasks/');
    grunt.registerTask('build', ['jshint', 'zubat', 'setver:build', 'compress', 'setver:renamezip']);
    grunt.registerTask('release', ['jshint', 'zubat', 'setver:release', 'compress', 'setver:renamezip']);
    grunt.registerTask('default', ['build']);
};
