module.exports = function (config) {
    config.set({
        basePath: '.',
        reporters: 'progress',
        frameworks: ['mocha', 'sinon-chai'],
        files: [
            '*.css',
            'test/.build/*.js'
        ],
        port: 9876,
        captureTimeout: 20000,
        reportSlowerThan: 500,
        browsers: ['Firefox'],
        singleRun: true
    });
};
