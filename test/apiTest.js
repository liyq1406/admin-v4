var chai = require('chai');
var api = require('../src/api.js');
chai.should();

describe('SMS Api', function () {
  describe('getVerifycode()', function () {
    var result = api.sms.getVerifycode({phone: '13800138000'});

    it('should return 200 when the request is done', function () {
      return result.then(function (data) {
        data.should.equal(200);
      });
    });
  });
});
