module.exports = function(grunt) {
    grunt.initConfig({
        'loopback_auto': {
            'db_autoupdate': {
                options: {
                    dataSource: 'mysql',
                    app: './server/server',
                    config: './server/model-config',
                    method: 'autoupdate',
                    exclude : ['User', 'user']
                }
            },
            'db_automigrate': {
                options: {
                    dataSource: 'mysql',
                    app: './server/server',
                    config: './server/model-config',
                    method: 'automigrate',
                    exclude : ['User', 'user']
                }
            }
        }
    });
    // Load the plugin
    grunt.loadNpmTasks('grunt-loopback-auto');
    grunt.registerTask('default', ['loopback_auto']);
};