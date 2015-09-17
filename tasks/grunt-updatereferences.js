'use strict';

module.exports = function(grunt) {
	grunt.registerTask('updatereferences', 'Update references folder with core theme and any other dependent themes', function() {
		grunt.initConfig({
			svn_export : { 
				
				update : {
					options : {
						bin : '/usr/bin/svn',
						repository : 'https://svn.brandlabs.local/repos/brandlabs-drace/tags/wireframe_base_approved/scripts/',
						output : './references/bl_wireframe/scripts --force'
					}
				},
				build : {
					options : {
						bin : '/usr/bin/svn',
						repository : 'https://svn.brandlabs.local/repos/brandlabs-drace/tags/wireframe_base_approved/build.js',
						output : './references/bl_wireframe/build.js --force'
					}
				},
				theme : {
					options : {
						bin : '/usr/bin/svn',
						repository : 'https://svn.brandlabs.local/repos/brandlabs-drace/tags/wireframe_base_approved/theme.json',
						output : './references/bl_wireframe/theme.json --force'
					}
				}
			}
		});
		grunt.task.run(['svn_export']);
	});
}; 