"use strict";

require("should");
var dateFormat = require("../lib");

describe("dateFormat.parse", function() {
  it("should require a pattern", function() {
    (function() {
      dateFormat.parse();
    }.should.throw(/pattern must be supplied/));
    (function() {
      dateFormat.parse(null);
    }.should.throw(/pattern must be supplied/));
    (function() {
      dateFormat.parse("");
    }.should.throw(/pattern must be supplied/));
  });

  describe("with a pattern that has no replacements", function() {
    it("should return a new date when the string matches", function() {
      dateFormat.parse("cheese", "cheese").should.be.a.Date();
    });

    it("should throw if the string does not match", function() {
      (function() {
        dateFormat.parse("cheese", "biscuits");
      }.should.throw(/String 'biscuits' could not be parsed as 'cheese'/));
    });
  });

  describe("with a full pattern", function() {
    var pattern = "yyyy-MM-dd hh:mm:ss.SSSO";

    it("should return the correct date if the string matches", function() {
      var testDate = new Date();
      testDate.setUTCFullYear(2018);
      testDate.setUTCMonth(8);
      testDate.setUTCDate(13);
      testDate.setUTCHours(18);
      testDate.setUTCMinutes(10);
      testDate.setUTCSeconds(12);
      testDate.setUTCMilliseconds(392);

      dateFormat
        .parse(pattern, "2018-09-14 04:10:12.392+1000")
        .getTime()
        .should.eql(testDate.getTime())
        ;
    });

    it("should throw if the string does not match", function() {
      (function() {
        dateFormat.parse(pattern, "biscuits");
      }.should.throw(
        /String 'biscuits' could not be parsed as 'yyyy-MM-dd hh:mm:ss.SSSO'/
      ));
    });
  });

  describe("with a partial pattern", function() {
    var testDate = new Date();
    dateFormat.now = function() {
      return testDate;
    };

    function verifyDate(actual, expected) {
      // To avoid OS timezone affecting the values, changing all comparisons to
      // use UTC.
      actual.getUTCFullYear().should.eql(expected.year || testDate.getUTCFullYear());
      actual.getUTCMonth().should.eql(expected.month || testDate.getUTCMonth());
      actual.getUTCDate().should.eql(expected.day || testDate.getUTCDate());
      actual.getUTCHours().should.eql(expected.hours || testDate.getUTCHours());
      actual.getUTCMinutes().should.eql(expected.minutes || testDate.getUTCMinutes());
      actual.getUTCSeconds().should.eql(expected.seconds || testDate.getUTCSeconds());
      actual
        .getMilliseconds()
        .should.eql(expected.milliseconds || testDate.getMilliseconds());
    }

    it("should return a date with missing values defaulting to current time", function() {
      var date = dateFormat.parse("yyyy-MM", "2015-09");
      verifyDate(date, { year: 2015, month: 8 });
    });

    it("should use a passed in date for missing values", function() {
      var missingValueDate = new Date(Date.UTC(2010, 1, 8, 22, 30, 12, 100));
      missingValueDate.setUTCMinutes(missingValueDate.getUTCMinutes() + missingValueDate.getTimezoneOffset());
      var date = dateFormat.parse("yyyy-MM", "2015-09", missingValueDate);
      verifyDate(date, {
        year: 2015,
        month: 8,
        // The missing value date and the new date to be parsed might have 
        // different DST in effect depending which timezone the operation system
        // set to where this test case is run on.  We cannot hard code the 
        // values for validation.  This is all caused by the Javascript Date 
        // object doesn't support timezone.  The 'getTimezoneOffset()' method 
        // can return different result running on different OS timezone and the
        // date/time the date object was set to.
        // As a matter of fact, the "missingValueDate" probably should not be 
        // supported in the first place.  The proper solution is to have replace
        // Javascript's Date with one that has timezone support.
        // The result might be few hours off or plus / minus a day or two
        // depending on the above mentioned reasons.
        day: missingValueDate.getUTCDate(),
        hours: missingValueDate.getUTCHours(),
        minutes: 30,
        seconds: 12,
        milliseconds: 100
      });
    });

    it("should handle variations on the same pattern", function() {
      var date = dateFormat.parse("MM-yyyy", "09-2015");
      verifyDate(date, { year: 2015, month: 8 });

      date = dateFormat.parse("yyyy MM", "2015 09");
      verifyDate(date, { year: 2015, month: 8 });

      date = dateFormat.parse("MM, yyyy.", "09, 2015.");
      verifyDate(date, { year: 2015, month: 8 });
    });

    describe("should match all the date parts", function() {
      // Test cases without timezone are invalid as the result varies depends on
      // OS timezone and the hour the test cases are executed.  
      // These use cases should not be supported in the first place.  Using 
      // them will ensure all your time filled with sadness.
      xit("works with dd", function() {
        var date = dateFormat.parse("dd", "21");
        verifyDate(date, { day: 21 });
      });

      xit("works with hh", function() {
        var date = dateFormat.parse("hh", "12");
        verifyDate(date, { hours: 12 });
      });

      xit("works with mm", function() {
        var date = dateFormat.parse("mm", "34");
        verifyDate(date, { minutes: 34 });
      });

      it("works with ss", function() {
        var date = dateFormat.parse("ss", "59");
        verifyDate(date, { seconds: 59 });
      });

      it("works with ss.SSS", function() {
        var date = dateFormat.parse("ss.SSS", "23.452");
        verifyDate(date, { seconds: 23, milliseconds: 452 });
      });

      it("works with hh:mm O (+1000)", function() {
        var date = dateFormat.parse("hh:mm O", "05:23 +1000");
        verifyDate(date, { hours: 19, minutes: 23 });
      });

      it("works with hh:mm O (-200)", function() {
        var date = dateFormat.parse("hh:mm O", "05:23 -200");
        verifyDate(date, { hours: 7, minutes: 23 });
      });

      it("works with hh:mm O (+0930)", function() {
        var date = dateFormat.parse("hh:mm O", "05:23 +0930");
        verifyDate(date, { hours: 19, minutes: 53 });
      });
    });
  });

  describe("with a date formatted by this library", function() {
    describe("should format and then parse back to the same date", function() {
      function testDateInitWithUTC() {
        var td = new Date();
        td.setUTCFullYear(2018);
        td.setUTCMonth(8);
        td.setUTCDate(13);
        td.setUTCHours(18);
        td.setUTCMinutes(10);
        td.setUTCSeconds(12);
        td.setUTCMilliseconds(392);
        return td;
      }

      function testDateInitWithLocal() {
        var td = new Date();
        td.setFullYear(2018);
        td.setMonth(8);
        td.setDate(13);
        td.setHours(18);
        td.setMinutes(10);
        td.setSeconds(12);
        td.setMilliseconds(392);
        return td;
      }

      xit("works with ISO8601_WITH_TZ_OFFSET_FORMAT", function() {
        // For this test case to work, the date object must be initialized with
        // UTC timezone
        var td = testDateInitWithUTC();
        var d = dateFormat(dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT, td);
        dateFormat.parse(dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT, d)
          .should.eql(td);
      });

      // The followings test cases are invalid and would only work when running
      // them with OS timezone set to UTC.  ISO8601 string is local time with 
      // timezone info.  Essentially, when the ISO8601 string is converted to
      // string without timezone, the timezone information is lost and not
      // recoverable.
      // These use cases will produce unpriditable results.  Use any of them if 
      // you'd like to gamble or to make rest of your life miserable. 
      xit("works with ISO8601_FORMAT", function() {
        var td = testDateInitWithLocal();
        var d = dateFormat(dateFormat.ISO8601_FORMAT, td);
        var actual = dateFormat.parse(dateFormat.ISO8601_FORMAT, d);
        actual.should.eql(td);
      });

      xit("works with DATETIME_FORMAT", function() {
        var testDate = testDateInitWithLocal();
        dateFormat
        .parse(
          dateFormat.DATETIME_FORMAT,
          dateFormat(dateFormat.DATETIME_FORMAT, testDate)
        )
        .should.eql(testDate);
      });

      xit("works with ABSOLUTETIME_FORMAT", function() {
        var testDate = testDateInitWithLocal();
        dateFormat
        .parse(
          dateFormat.ABSOLUTETIME_FORMAT,
          dateFormat(dateFormat.ABSOLUTETIME_FORMAT, testDate)
        )
        .should.eql(testDate);
      });
    });
  });
});
