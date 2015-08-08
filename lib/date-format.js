  /**
   * node.js formatting of Date objects as strings. Probably exactly the same as some other library out there.
   * https://www.npmjs.com/package/date-format
   */
var website = website || {};

(function (publics) {
  "use strict";

  var privates = {};

  /*
   * For browser with `website.utils.dateFormat`.
   */
  publics.utils = website.utils || {};

  privates.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
  privates.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
  privates.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
  privates.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

  privates.addZero = function (number) {
    return privates.padWithZeros(number, 2);
  };

  privates.padWithZeros = function (number, width) {
    number = number + "";
    while (number.length < width) {
      number = "0" + number;
    }
    return number;
  };

  /**
   * Formats the TimeOffest.
   * Thanks to http://www.svendtofte.com/code/date_format/
   * @private
   */
  privates.offset = function (date) {
    // Difference to Greenwich time (GMT) in hours
    var millisecond = Math.abs(date.getTimezoneOffset()),
      hour = String(Math.floor(millisecond / 60)),
      minute = String(millisecond % 60);

    if (hour.length === 1) {
      hour = "0" + hour;
    }
    if (minute.length === 1) {
      minute = "0" + minute;
    }

    return date.getTimezoneOffset() < 0 ? "+" + hour + minute : "-" + hour + minute;
  };

  privates.backslashNoReplace = function (match, variable) {
    if (match.indexOf('\\') === 0) {
      return match.replace('\\', '');
    } else {
      return variable;
    }
  };

  /*
   * Main function.
   */
  publics.utils.dateFormat = function (/*format,*/ date, monthNames, dayNames) {
    var format = format || privates.ISO8601_FORMAT;

    if (typeof date === "string") {
      format = arguments[0];
      date = arguments[1];
      monthNames = arguments[2];
      dayNames = arguments[3];
    }

    if (!date) {
      date = new Date();
    }

    var day = privates.addZero(date.getDate()),
        dayNumber = privates.addZero(date.getDay() + 1),
        dayName = date.getDay() + 1,
        month = privates.addZero(date.getMonth() + 1),
        monthName = date.getMonth() + 1,
        yearLong = privates.addZero(date.getFullYear()),
        yearShort = privates.addZero(date.getFullYear().toString().substring(2,4)),
        year = (format.indexOf("yyyy") > -1 ? yearLong : yearShort),
        hour  = privates.addZero(date.getHours()),
        minute = privates.addZero(date.getMinutes()),
        second = privates.addZero(date.getSeconds()),
        millisecond = privates.padWithZeros(date.getMilliseconds(), 3),
        timeZone = privates.offset(date),
        formatted;

    if (typeof dayNames === 'object' && dayNames instanceof Array) {
      dayName = dayNames[date.getDay()];
    }
    if (typeof monthNames === 'object' && monthNames instanceof Array) {
      monthName = monthNames[date.getMonth()];
    }

    formatted = format
      .replace(/(\\DDDD|DDDD)/g, function (match) { return privates.backslashNoReplace(match, dayName); })
      .replace(/(\\DD|DD)/g, function (match) { return privates.backslashNoReplace(match, dayNumber); })
      .replace(/(\\dd|dd)/g, function (match) { return privates.backslashNoReplace(match, day); })
      .replace(/(\\MMMM|MMMM)/g, function (match) { return privates.backslashNoReplace(match, monthName); })
      .replace(/(\\MM|MM)/g, function (match) { return privates.backslashNoReplace(match, month); })
      .replace(/(\\y{2,4}|y{2,4})/g, function (match) { return privates.backslashNoReplace(match, year); })
      .replace(/(\\hh|hh)/g, function (match) { return privates.backslashNoReplace(match, hour); })
      .replace(/(\\mm|mm)/g, function (match) { return privates.backslashNoReplace(match, minute); })
      .replace(/(\\ss|ss)/g, function (match) { return privates.backslashNoReplace(match, second); })
      .replace(/(\\SSS|SSS)/g, function (match) { return privates.backslashNoReplace(match, millisecond); })
      .replace(/(\\O|O)/g, function (match) { return privates.backslashNoReplace(match, timeZone); });

    return formatted;
  };

  /*
   * Pre-setted dateFormat.
   */
  publics.utils.dateFormat.ISO8601_FORMAT = privates.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
  publics.utils.dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT = privates.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
  publics.utils.dateFormat.DATETIME_FORMAT = privates.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
  publics.utils.dateFormat.ABSOLUTETIME_FORMAT = privates.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

  /*
   * For browser with `website.utils.dateFormat.asString` or
   * For Node.js with `require('date-format').asString`.
   */
  publics.utils.dateFormat.asString = publics.utils.dateFormat;
}(website));

/*
 * For Node.js `require`.
 */
if (typeof module === 'object') {
  module.exports = website.utils.dateFormat;
}