module.exports = function (config) {
    config.set({
        basePath: '.',
        reporters: 'progress',
        frameworks: ['mocha', 'sinon-chai', 'browserify'],
        preprocessor: {
            'test/*.spec.js': 'browserify'
        },
        files: [
            'd3.chart.<%= meta.chartName %>.{css,default.css}',
            'test/*.spec.js'
        ],
        port: 9876,
        captureTimeout: 20000,
        reportSlowerThan: 500
    });
};
