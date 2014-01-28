'use strict';

var util = require('../src/util.js');

describe('util', function () {
    describe('makeProp', function () {
        var obj = {};

        before(function () {
            obj.test = util.makeProp('test_');
            obj.testWf = util.makeProp('testWf_', function (it) {
                this.other_ = it + '_yay';
            });
        });

        it('should assign a value', function () {
            obj.test(36);
            obj.test_.should.equal(36);
        });

        it('should assign a value and call handler', function () {
            obj.testWf('foobar');
            obj.other_.should.equal('foobar_yay');
        });

        it('should be chainable', function () {
            obj.test(42).test(48);
            obj.test_.should.equal(48);
            obj.testWf('foo').testWf('bar');
            obj.testWf_.should.equal('bar');
        });

        it('should get the value', function () {
            obj.test_ = 48;
            var result = obj.test();
            result.should.equal(48);
        });
    });

    describe('textRuler', function() {
        var svg, ruler;

        before(function() {
            svg = d3.select('body').append('svg');
            ruler = util.textRuler(svg);
        });

        after(function() {
            ruler = null;
            svg.remove();
            svg = null;
        });

        it('should measure some length', function() {
            var l1 = ruler('bar');
            var l2 = ruler('foobar');
            l1.should.be.above(0);
            l2.should.be.above(l1);
        });

        it('should measure extent', function() {
            var l1 = ruler.extentOfChar('l');
            var l2 = ruler.extentOfChar('W');
            l1.width.should.be.above(0);
            l2.width.should.be.above(l1.width);
            l1.height.should.be.above(0);
            l2.height.should.equal(l1.height);
        });
    });
});
