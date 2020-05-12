var request = require('supertest');
var app = require('../app.js');

describe('GET /', function() {
  it('respond with hello world', function(done) {
    request(app).get('/courses').end(function(err, res) { 
          expect(res.statusCode).to.equal(200); 
          expect(res.body).to.be.an('array'); 
          //expect(res.body).to.be.empty; 
          done(); 
        }); 
  });
});
