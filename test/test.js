var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var renderer = require('../app/js/renderer');
var entity = require('../app/js/entity');
var map = require('../app/js/map');

describe('entry index file', function() {
  describe('the game scripts', function() {
    describe('map module', function() {
      before(function() {
        var Map = new Map();
      });

      it('should generate a random map', function() {
        expect(Map.genMap());
      });
    });
  });
});