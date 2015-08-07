date-format
===========

node.js formatting of Date objects as strings. Probably exactly the same as some other library out there.

```sh
npm install date-format
```

usage
=====

Node.js
-------

```js
var format = require('date-format');
format.asString(new Date()); //defaults to ISO8601 format
format.asString('hh:mm:ss.SSS', new Date()); //just the time
```

or

```js
var format = require('date-format');
format(new Date());
format('hh:mm:ss.SSS', new Date());
```


Browser
-------
```html
<script type="text/javascript" scr="date-format.js"></script>
```

```js
var format = website.utils.dateFormat;
format.asString(new Date()); //defaults to ISO8601 format
format.asString('hh:mm:ss.SSS', new Date()); //just the time
```

or

```js
var format = website.utils.dateFormat;
format(new Date());
format('hh:mm:ss.SSS', new Date());
```

Format string can be anything, but the following letters will be replaced (and leading zeroes added if necessary):
* DDDD - `date.getDay()`
* dd - `date.getDate()`
* MM - `date.getMonth() + 1`
* MMMM - `date.getMonth()`
* yy - `date.getFullYear().toString().substring(2, 4)`
* yyyy - `date.getFullYear()`
* hh - `date.getHours()`
* mm - `date.getMinutes()`
* ss - `date.getSeconds()`
* SSS - `date.getMilliseconds()`
* O - timezone offset in +hm format

That's it.



More stuff
==========

By passing an array for months and/or for days, you could obtain this:

```js
var format = require('date-format'),
	monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
	dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
format('DDDD dd MMMM yyyy', new Date(), monthNames, dayNames); 
// => Lundi 10 Janvier 2010
```

If you want enter text and not date format, escape with backslash:

```js
var format = require('date-format');
format('Communauty since dd/MM/YYYY', new Date(), monthNames, dayNames); 
// => Co48unauty 10/01/2010
```

but 

```js
var format = require('date-format');
format('Co\mmunauty since dd/MM/YYYY', new Date(), monthNames, dayNames); 
// => Communauty 10/01/2010
```