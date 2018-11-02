'use strict';

require('should');
var dateFormat = require('../lib');

describe('dateFormat.parse', function() {
  it('should require a pattern', function() {
    (function() { dateFormat.parse() }).should.throw(/pattern must be supplied/);
    (function() { dateFormat.parse(null) }).should.throw(/pattern must be supplied/);
    (function() { dateFormat.parse('') }).should.throw(/pattern must be supplied/);
  });

  describe('with a pattern that has no replacements', function() {
    it('should return a new date when the string matches', function() {
      dateFormat.parse('cheese', 'cheese').should.be.a.Date()
    });

    it('should throw if the string does not match', function() {
      (function() {
        dateFormat.parse('cheese', 'biscuits');
      }).should.throw(/String 'biscuits' could not be parsed as 'cheese'/);
    });
  });

  describe('with a full pattern', function() {
    var pattern = 'yyyy-MM-dd HH:mm:ss.SSSO';

    it('should return the correct date if the string matches', function() {
      var testDate = new Date();
      testDate.setUTCFullYear(2018);
      testDate.setUTCMonth(8);
      testDate.setUTCDate(13);
      testDate.setUTCHours(22);
      testDate.setUTCMinutes(10);
      testDate.setUTCSeconds(12);
      testDate.setUTCMilliseconds(392);

      dateFormat.parse(pattern, '2018-09-14 08:10:12.392+10:00').should.eql(testDate);
    });

    it('should throw if the string does not match', function() {
      (function() {
        dateFormat.parse(pattern, 'biscuits')
      }).should.throw(/String 'biscuits' could not be parsed as 'yyyy-MM-dd HH:mm:ss.SSSO'/);
    });
  });

  describe('with a partial pattern', function() {
    var testDate = new Date();
    dateFormat.now = function() { return testDate; };

    function verifyDate(actual, expectedYear, expectedMonth) {
      actual.getUTCFullYear().should.eql(expectedYear);
      actual.getUTCMonth().should.eql(expectedMonth);
      actual.getUTCDate().should.eql(testDate.getUTCDate());
      actual.getUTCHours().should.eql(testDate.getUTCHours());
      actual.getUTCMinutes().should.eql(testDate.getUTCMinutes());
      actual.getUTCSeconds().should.eql(testDate.getUTCSeconds());
      actual.getUTCMilliseconds().should.eql(testDate.getUTCMilliseconds());
    }

    it('should return a date with missing values defaulting to current time', function() {
      var date = dateFormat.parse('yyyy-MM', '2015-09');
      verifyDate(date, 2015, 9);
    });

    it('should handle variations on the same pattern', function() {
      var date = dateFormat.parse('MM-yyyy', '09-2015');
      verifyDate(date, 2015, 9);

      date = dateFormat.parse('yyyy MM', '2015 09');
      verifyDate(date, 2015, 9);

      date = dateFormat.parse('MM, yyyy.', '09, 2015.');
      verifyDate(date, 2015, 9);
    });
  });
});
