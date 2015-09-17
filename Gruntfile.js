module.exports = function(grunt) {

  var jsonFiles = [
        'theme.json',
        'theme-ui.json',
        'package.json',
        'labels/*.json'
    ],
    jsFiles = [
        'Gruntfile.js',
        'build.js',
        'scripts/**/*.js'
    ],
    filesToArchive = [
        '**',
        '!node_modules/**',
        '!references/**',
        '!tasks/**',
        '!configure.js',
        '!Gruntfile.js',
        "!*.zip"
    ],
    versionCmd = ':'; // e.g. 'git describe --tags --always' or 'svn info'

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        jsonlint : {
            theme_json : {
                src : jsonFiles
            }
        },
        jshint : {
            theme_js : jsFiles,
            options : {
                ignores : ['build.js', 'scripts/vendor/**/*.js'],
                undef : true,
                laxcomma : true,
                unused : false,
                "-W099" : true,
                "-W061" : true,
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
        zubat: {
            main: {
                dir: '.',
                ignore: ['\\.references', '\\.git', 'node_modules', '^/resources', '^/tasks', '\\.zip$']
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
        setver: {
          release: {
            cmd: versionCmd,
            themejson: true,
            packagejson: true,
            readmemd: true,
            thumbnail : {
                src : 'thumb.tpt.png',
                color : '#000000',
                pointsize : 18,
                dest : 'thumb.png'
            }
          },
          build: {
            cmd: versionCmd,
            themejson: true,
            thumbnail : {
                src : 'thumb.tpt.png',
                color : '#ffffff',
                pointsize : 12,
                dest : 'thumb.png'
            }
          },
          renamezip: {
            cmd: versionCmd,
            filenames: ["<%= pkg.name %>.zip"]
          }
        },
        watch: {
            json: {
                files: [
                    'theme.json',
                    'theme-ui.json',
                    'labels/**/*.json'
                ],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            },
            javascript: {
                files: [
                    'scripts/**/*.js'
                ],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        }
    });

  [
   'grunt-jsonlint',
   'grunt-contrib-jshint',
   'grunt-contrib-watch',
   'grunt-contrib-compress'
  ].forEach(grunt.loadNpmTasks);

  grunt.loadTasks('./tasks/');

  grunt.registerTask('build', ['jsonlint', 'jshint', 'zubat', 'setver:build', 'compress', 'setver:renamezip']);
  grunt.registerTask('release', ['jsonlint', 'jshint', 'zubat', 'setver:release', 'compress', 'setver:renamezip']);
  grunt.registerTask('default', ['build']);

};
