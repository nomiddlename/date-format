'use strict';

function padWithZeros(vNumber, width) {
    var numAsString = vNumber.toString();
    while (numAsString.length < width) {
        numAsString = '0' + numAsString;
    }
    return numAsString;
}

function addZero(vNumber) {
    return padWithZeros(vNumber, 2);
}

/**
 * Formats the TimeOffset
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(timezoneOffset) {
    // Difference to Greenwich time (GMT) in hours
    var os = Math.abs(timezoneOffset);
    var h = String(Math.floor(os / 60));
    var m = String(os % 60);
    if (h.length === 1) {
        h = '0' + h;
    }
    if (m.length === 1) {
        m = '0' + m;
    }
    return timezoneOffset < 0 ? '+' + h + m : '-' + h + m;
}

function asString(format, date, timezoneOffset) {
    if (typeof format !== 'string') {
        timezoneOffset = date;
        date = format;
        format = module.exports.ISO8601_FORMAT;
    }
    if (!date) {
        date =  module.exports.now();
    }
    // make the date independent of the system timezone by working with UTC
    if (timezoneOffset === undefined) {
        timezoneOffset = date.getTimezoneOffset();
    }

    date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
    var vDay = addZero(date.getUTCDate());
    var vMonth = addZero(date.getUTCMonth() + 1);
    var vYearLong = addZero(date.getUTCFullYear());
    var vYearShort = addZero(date.getUTCFullYear().toString().substring(2, 4));
    var vYear = (format.indexOf('yyyy') > -1 ? vYearLong : vYearShort);
    var vHour = addZero(date.getUTCHours());
    var vMinute = addZero(date.getUTCMinutes());
    var vSecond = addZero(date.getUTCSeconds());
    var vMillisecond = padWithZeros(date.getUTCMilliseconds(), 3);
    var vTimeZone = offset(timezoneOffset);
    date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
    var formatted = format
        .replace(/dd/g, vDay)
        .replace(/MM/g, vMonth)
        .replace(/y{1,4}/g, vYear)
        .replace(/hh/g, vHour)
        .replace(/mm/g, vMinute)
        .replace(/ss/g, vSecond)
        .replace(/SSS/g, vMillisecond)
        .replace(/O/g, vTimeZone);
    return formatted;
}

function extractDateParts(pattern, str) {
  var matchers = [
    { pattern: /y{1,4}/, regexp: "\\d{1,4}", fn: function(date, value) { date.setUTCFullYear(value); } },
    { pattern: /MM/, regexp: "\\d{1,2}", fn: function(date, value) { date.setUTCMonth(value); } },
    // { pattern: /dd/, regexp: "\\d{1,2}", fn: function(date, value) { date.setUTCDate(value); } },
    // { pattern: /hh/, regexp: "\\d{1,2}", fn: function(date, value) { date.setUTCHours(value); } },
    // { pattern: /mm/, regexp: "\\d\\d", fn: function(date, value) { date.setUTCMinutes(value); } },
    // { pattern: /ss/, regexp: "\\d\\d", fn: function(date, value) { date.setUTCSeconds(value); } },
    // { pattern: /SSS/, regexp: "\\d\\d\\d", fn: function(date, value) { date.setUTCMilliseconds(value); } },
    // { pattern: /O/, regexp: "[+-]\\d{1,4}", fn: function(date, value) { date.set} }
  ];

  var parsedPattern = matchers.reduce(function(p, m) {
    if (m.pattern.test(p.regexp)) {
      m.index = p.regexp.match(m.pattern).index;
      p.regexp = p.regexp.replace(m.pattern, "(" + m.regexp + ")");
    } else {
      m.index = -1;
    }
    return p;
  }, { regexp: pattern, index: [] });

  var dateFns = matchers.filter(function(m) {
    return m.index > -1;
  });
  dateFns.sort(function(a, b) { return a.index - b.index; });

  var matcher = new RegExp(parsedPattern.regexp);
  var matches = matcher.exec(str);
  if (matches) {
    var date = module.exports.now();
    dateFns.forEach(function(f, i) {
      f.fn(date, matches[i+1]);
    });
    return date;
  }

  throw new Error('String \'' + str + '\' could not be parsed as \'' + pattern + '\'');
}

function parse(pattern, str) {
  if (!pattern) {
    throw new Error('pattern must be supplied');
  }

  return extractDateParts(pattern, str);
}

/**
 * Used for testing - replace this function with a fixed date.
 */
function now() {
  return new Date();
}

module.exports = asString;
module.exports.asString = asString;
module.exports.parse = parse;
module.exports.now = now;
module.exports.ISO8601_FORMAT = 'yyyy-MM-ddThh:mm:ss.SSS';
module.exports.ISO8601_WITH_TZ_OFFSET_FORMAT = 'yyyy-MM-ddThh:mm:ss.SSSO';
module.exports.DATETIME_FORMAT = 'dd MM yyyy hh:mm:ss.SSS';
module.exports.ABSOLUTETIME_FORMAT = 'hh:mm:ss.SSS';
