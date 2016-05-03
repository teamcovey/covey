var express = require('express');
var passport = require('passport');
var request = require('supertest');

describe('app', function() {
  describe('GET /', function() {
    it('should return 403 when no user is logged in', function(done) {

      var app = express();
      app.use(passport.initialize());
      app.use(passport.session());
      app.get('/', function(req, res){
        if (!req.user || !req.isAuthenticated()){
          return res.send(403);
        }
        res.send(200);
      });

      request(app)
        .get('/')
        .expect(403)
        .end(done);
    });
    it('should return 200 when user is logged in', function(done) {

      var app = express();
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(function(req, res, next) {
        req.isAuthenticated = function() {
          return true;
        };
        req.user = {};
        next();
      });
      app.get('/', function(req, res){
        if (!req.user || !req.isAuthenticated()){
          return res.send(403);
        }
        res.send(200);
      });

      request(app)
        .get('/')
        .expect(200)
        .end(done);

    });
  });
});