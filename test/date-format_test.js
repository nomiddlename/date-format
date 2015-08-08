"use strict";
var should = require('should')
, dateFormat = require('../lib/date-format');

describe('date-format', function() {
  var date = new Date(2010, 0, 11, 14, 31, 30, 5);

  it('should format a date as string using a pattern', function() {
    dateFormat.asString(dateFormat.DATETIME_FORMAT, date).should.eql("11 01 2010 14:31:30.005");
  });

  it('should default to the ISO8601 format', function() {
    dateFormat.asString(date).should.eql('2010-01-11 14:31:30.005');
  });

  it('should provide a ISO8601 with timezone offset format', function() {
    date.getTimezoneOffset = function() { return -660; };
    dateFormat.asString(
      dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT, 
      date
    ).should.eql(
      "2010-01-11T14:31:30+1100"
    );

    date.getTimezoneOffset = function() { return 120; };
    dateFormat.asString(
      dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT, 
      date
    ).should.eql(
      "2010-01-11T14:31:30-0200"
    );
  });

  it('should provide a just-the-time format', function() {
    dateFormat.asString(dateFormat.ABSOLUTETIME_FORMAT, date).should.eql('14:31:30.005');
  });

  it('should provide a custom format', function() {
    date.getTimezoneOffset = function() { return 120; };
    dateFormat.asString("O.SSS.ss.mm.hh.dd.MM.yy", date).should.eql('-0200.005.30.31.14.11.01.10');
  });

  it('should format a date as string using name of day and month in english', function() {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December'],
        dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dateFormat("MMMM the ddth, yyyy. It's a DDDD.", date, monthNames, dayNames).should.eql("January the 11th, 2010. It's a Monday.");
  });

  it('should format a date as string using name of day and month in french', function() {
    var monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
        dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    dateFormat("Le DDDD dd MMMM yyyy à hh:mm:ss", date, monthNames, dayNames).should.eql("Le Lundi 11 Janvier 2010 à 14:31:30");
  });

  it('should format a date as string using name of day and month without array', function() {
    dateFormat("It's day number DDDD and month number MMMM.", date).should.eql("It's day number 2 and month number 1.");
  });

  it('should format a date as string using name of day and month without array', function() {
    dateFormat("It's day number DD and month number MM.", date).should.eql("It's day number 02 and month number 01.");
  });

  it('should format a date with text', function() {
    dateFormat("Community Address Orbit vs Co\\mmunity A\\ddre\\ss \\Orbit.", date).should.eql("Co31unity A11re30 -0200rbit vs Community Address Orbit.");
  });
});
