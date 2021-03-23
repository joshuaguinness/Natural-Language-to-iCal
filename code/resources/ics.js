// ics.js library - used to handle iCalendar file generation with parsed data 
// for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter
// https://github.com/nwcell/ics.js
// ===============================================


/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function(uidDomain, prodId) {
	'use strict';
	
	if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
		console.log('Unsupported Browser');
		return;
	}
	
	if (typeof uidDomain === 'undefined') { uidDomain = 'default'; }
	if (typeof prodId === 'undefined') { prodId = 'Calendar'; }
	
	var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
	var calendarEvents = [];
	var calendarStart = [
		'BEGIN:VCALENDAR',
		'PRODID:' + prodId,
		'VERSION:2.0'
	].join(SEPARATOR);
	var calendarEnd = SEPARATOR + 'END:VCALENDAR';
	var BYDAY_VALUES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
	
	return {
		/**
			* Returns events array
			* @return {array} Events
		*/
		'events': function() {
			return calendarEvents;
		},
		
		/**
			* Returns calendar
			* @return {string} Calendar in iCalendar format
		*/
		'calendar': function() {
			return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
		},
		
		/**
			* Add event to the calendar
			* @param  {string} subject     Subject/Title of event
			* @param  {string} description Description of event
			* @param  {string} location    Location of event
			* @param  {string} begin       Beginning date of event
			* @param  {string} stop        Ending date of event
		*/
		'addEvent': function(subject, description, location, begin, stop, rrule) {
			// I'm not in the mood to make these optional... So they are all required
			if (typeof subject === 'undefined' ||
				typeof description === 'undefined' ||
				typeof location === 'undefined' ||
				typeof begin === 'undefined' ||
				typeof stop === 'undefined'
				) {
				return false;
			}
			
			// validate rrule
			if (rrule) {
				if (!rrule.rrule) {
					if (rrule.freq !== 'YEARLY' && rrule.freq !== 'MONTHLY' && rrule.freq !== 'WEEKLY' && rrule.freq !== 'DAILY') {
						throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
					}
					
					if (rrule.until) {
						if (isNaN(Date.parse(rrule.until))) {
							throw "Recurrence rrule 'until' must be a valid date string";
						}
					}
					
					if (rrule.interval) {
						if (isNaN(parseInt(rrule.interval))) {
							throw "Recurrence rrule 'interval' must be an integer";
						}
					}
					
					if (rrule.count) {
						if (isNaN(parseInt(rrule.count))) {
							throw "Recurrence rrule 'count' must be an integer";
						}
					}
					
					if (typeof rrule.byday !== 'undefined') {
						if ((Object.prototype.toString.call(rrule.byday) !== '[object Array]')) {
							throw "Recurrence rrule 'byday' must be an array";
						}
						
						if (rrule.byday.length > 7) {
							throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
						}
						
						// Filter any possible repeats
						rrule.byday = rrule.byday.filter(function(elem, pos) {
							return rrule.byday.indexOf(elem) == pos;
						});
						
						for (var d in rrule.byday) {
							if (BYDAY_VALUES.indexOf(rrule.byday[d]) < 0) {
								throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
							}
						}
					}
				}
			}
			
			//TODO add time and time zone? use moment to format?
			var start_date = new Date(begin);
			var end_date = new Date(stop);
			var now_date = new Date();
			
			var start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4);
			var start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2);
			var start_day = ("00" + ((start_date.getDate()).toString())).slice(-2);
			var start_hours = ("00" + (start_date.getHours().toString())).slice(-2);
			var start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2);
			var start_seconds = ("00" + (start_date.getSeconds().toString())).slice(-2);
			
			var end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4);
			var end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2);
			var end_day = ("00" + ((end_date.getDate()).toString())).slice(-2);
			var end_hours = ("00" + (end_date.getHours().toString())).slice(-2);
			var end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2);
			var end_seconds = ("00" + (end_date.getSeconds().toString())).slice(-2);
			
			var now_year = ("0000" + (now_date.getFullYear().toString())).slice(-4);
			var now_month = ("00" + ((now_date.getMonth() + 1).toString())).slice(-2);
			var now_day = ("00" + ((now_date.getDate()).toString())).slice(-2);
			var now_hours = ("00" + (now_date.getHours().toString())).slice(-2);
			var now_minutes = ("00" + (now_date.getMinutes().toString())).slice(-2);
			var now_seconds = ("00" + (now_date.getSeconds().toString())).slice(-2);
			
			// Since some calendars don't add 0 second events, we need to remove time if there is none...
			var start_time = '';
			var end_time = '';
			if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds != 0) {
				start_time = 'T' + start_hours + start_minutes + start_seconds;
				end_time = 'T' + end_hours + end_minutes + end_seconds;
			}
			var now_time = 'T' + now_hours + now_minutes + now_seconds;
			
			var start = start_year + start_month + start_day + start_time;
			var end = end_year + end_month + end_day + end_time;
			var now = now_year + now_month + now_day + now_time;
			
			// recurrence rrule vars
			var rruleString;
			if (rrule) {
				if (rrule.rrule) {
					rruleString = rrule.rrule;
					} else {
					rruleString = 'rrule:FREQ=' + rrule.freq;
					
					if (rrule.until) {
						var uDate = new Date(Date.parse(rrule.until)).toISOString();
						rruleString += ';UNTIL=' + uDate.substring(0, uDate.length - 13).replace(/[-]/g, '') + '000000Z';
					}
					
					if (rrule.interval) {
						rruleString += ';INTERVAL=' + rrule.interval;
					}
					
					if (rrule.count) {
						rruleString += ';COUNT=' + rrule.count;
					}
					
					if (rrule.byday && rrule.byday.length > 0) {
						rruleString += ';BYDAY=' + rrule.byday.join(',');
					}
				}
			}
			
			var stamp = new Date().toISOString();
			
			var calendarEvent = [
				'BEGIN:VEVENT',
				'UID:' + calendarEvents.length + "@" + uidDomain,
				'CLASS:PUBLIC',
				'DESCRIPTION:' + description,
				'DTSTAMP;VALUE=DATE-TIME:' + now,
				'DTSTART;VALUE=DATE-TIME:' + start,
				'DTEND;VALUE=DATE-TIME:' + end,
				'LOCATION:' + location,
				'SUMMARY;LANGUAGE=en-us:' + subject,
				'TRANSP:TRANSPARENT',
				'END:VEVENT'
			];
			
			if (rruleString) {
				calendarEvent.splice(4, 0, rruleString);
			}
			
			calendarEvent = calendarEvent.join(SEPARATOR);
			
			calendarEvents.push(calendarEvent);
			return calendarEvent;
		},
		
		/**
			* Download calendar using the saveAs function from filesave.js
			* @param  {string} filename Filename
			* @param  {string} ext      Extention
		*/
		'download': function(filename, ext) {
			if (calendarEvents.length < 1) {
				return false;
			}
			
			ext = (typeof ext !== 'undefined') ? ext : '.ics';
			filename = (typeof filename !== 'undefined') ? filename : 'calendar';
			var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
			
			var blob;
			if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
				blob = new Blob([calendar]);
				} else { // ie
				var bb = new BlobBuilder();
				bb.append(calendar);
				blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
			}
			saveAs(blob, filename + ext);
			return calendar;
		},
		
		/**
			* Build and return the ical contents
		*/
		'build': function() {
			if (calendarEvents.length < 1) {
				return false;
			}
			
			var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
			
			return calendar;
		}
	};
};


/*! ics.js Wed Aug 20 2014 17:23:02 */
var saveAs = saveAs || function (e) {
	"use strict";
	if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return
	}
	var t = e.document,
	n = function () {
		return e.URL || e.webkitURL || e
	},
	r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
	o = "download" in r,
	a = function (e) {
		var t = new MouseEvent("click");
		e.dispatchEvent(t)
	},
	i = /constructor/i.test(e.HTMLElement) || e.safari,
	f = /CriOS\/[\d]+/.test(navigator.userAgent),
	u = function (t) {
		(e.setImmediate || e.setTimeout)(function () {
			throw t
		}, 0)
	},
	s = "application/octet-stream",
	d = 1e3 * 40,
	c = function (e) {
		var t = function () {
			if (typeof e === "string") {
				n().revokeObjectURL(e)
				} else {
				e.remove()
			}
		};
		setTimeout(t, d)
	},
	l = function (e, t, n) {
		t = [].concat(t);
		var r = t.length;
		while (r--) {
			var o = e["on" + t[r]];
			if (typeof o === "function") {
				try {
					o.call(e, n || e)
					} catch (a) {
					u(a)
				}
			}
		}
	},
	p = function (e) {
		if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
			return new Blob([String.fromCharCode(65279), e], {
				type: e.type
			})
		}
		return e
	},
	v = function (t, u, d) {
		if (!d) {
			t = p(t)
		}
		var v = this,
		w = t.type,
		m = w === s,
		y, h = function () {
			l(v, "writestart progress write writeend".split(" "))
		},
		S = function () {
			if ((f || m && i) && e.FileReader) {
				var r = new FileReader;
				r.onloadend = function () {
					var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
					var n = e.open(t, "_blank");
					if (!n) e.location.href = t;
					t = undefined;
					v.readyState = v.DONE;
					h()
				};
				r.readAsDataURL(t);
				v.readyState = v.INIT;
				return
			}
			if (!y) {
				y = n().createObjectURL(t)
			}
			if (m) {
				e.location.href = y
				} else {
				var o = e.open(y, "_blank");
				if (!o) {
					e.location.href = y
				}
			}
			v.readyState = v.DONE;
			h();
			c(y)
		};
		v.readyState = v.INIT;
		if (o) {
			y = n().createObjectURL(t);
			setTimeout(function () {
				r.href = y;
				r.download = u;
				a(r);
				h();
				c(y);
				v.readyState = v.DONE
			});
			return
		}
		S()
	},
	w = v.prototype,
	m = function (e, t, n) {
		return new v(e, t || e.name || "download", n)
	};
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function (e, t, n) {
			t = t || e.name || "download";
			if (!n) {
				e = p(e)
			}
			return navigator.msSaveOrOpenBlob(e, t)
		}
	}
	w.abort = function () {};
	w.readyState = w.INIT = 0;
	w.WRITING = 1;
	w.DONE = 2;
	w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
	return m
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
	module.exports.saveAs = saveAs
	} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
	define("FileSaver.js", function () {
		return saveAs
	})
}

var ics = function (e, t) {
	"use strict"; {
		if (!(navigator.userAgent.indexOf("MSIE") > -1 && -1 == navigator.userAgent.indexOf("MSIE 10"))) {
			void 0 === e && (e = "default"), void 0 === t && (t = "Calendar");
			var r = -1 !== navigator.appVersion.indexOf("Win") ? "\r\n" : "\n",
			n = [],
			i = ["BEGIN:VCALENDAR", "PRODID:" + t, "VERSION:2.0"].join(r),
			o = r + "END:VCALENDAR",
			a = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
			return {
				events: function () {
					return n
				},
				calendar: function () {
					return i + r + n.join(r) + o
				},
				addEvent: function (t, i, o, l, u, s) {
					if (void 0 === t || void 0 === i || void 0 === o || void 0 === l || void 0 === u) return !1;
					if (s && !s.rrule) {
						if ("YEARLY" !== s.freq && "MONTHLY" !== s.freq && "WEEKLY" !== s.freq && "DAILY" !== s.freq) throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
						if (s.until && isNaN(Date.parse(s.until))) throw "Recurrence rrule 'until' must be a valid date string";
						if (s.interval && isNaN(parseInt(s.interval))) throw "Recurrence rrule 'interval' must be an integer";
						if (s.count && isNaN(parseInt(s.count))) throw "Recurrence rrule 'count' must be an integer";
						if (void 0 !== s.byday) {
							if ("[object Array]" !== Object.prototype.toString.call(s.byday)) throw "Recurrence rrule 'byday' must be an array";
							if (s.byday.length > 7) throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
							s.byday = s.byday.filter(function (e, t) {
								return s.byday.indexOf(e) == t
							});
							for (var c in s.byday)
							if (a.indexOf(s.byday[c]) < 0) throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"
						}
					}
					var g = new Date(l),
					d = new Date(u),
					f = new Date,
					S = ("0000" + g.getFullYear().toString()).slice(-4),
					E = ("00" + (g.getMonth() + 1).toString()).slice(-2),
					v = ("00" + g.getDate().toString()).slice(-2),
					y = ("00" + g.getHours().toString()).slice(-2),
					A = ("00" + g.getMinutes().toString()).slice(-2),
					T = ("00" + g.getSeconds().toString()).slice(-2),
					b = ("0000" + d.getFullYear().toString()).slice(-4),
					D = ("00" + (d.getMonth() + 1).toString()).slice(-2),
					N = ("00" + d.getDate().toString()).slice(-2),
					h = ("00" + d.getHours().toString()).slice(-2),
					I = ("00" + d.getMinutes().toString()).slice(-2),
					R = ("00" + d.getMinutes().toString()).slice(-2),
					M = ("0000" + f.getFullYear().toString()).slice(-4),
					w = ("00" + (f.getMonth() + 1).toString()).slice(-2),
					L = ("00" + f.getDate().toString()).slice(-2),
					O = ("00" + f.getHours().toString()).slice(-2),
					p = ("00" + f.getMinutes().toString()).slice(-2),
					Y = ("00" + f.getMinutes().toString()).slice(-2),
					U = "",
					V = "";
					y + A + T + h + I + R != 0 && (U = "T" + y + A + T, V = "T" + h + I + R);
					var B, C = S + E + v + U,
					j = b + D + N + V,
					m = M + w + L + ("T" + O + p + Y);
					if (s)
					if (s.rrule) B = s.rrule;
					else {
						if (B = "rrule:FREQ=" + s.freq, s.until) {
							var x = new Date(Date.parse(s.until)).toISOString();
							B += ";UNTIL=" + x.substring(0, x.length - 13).replace(/[-]/g, "") + "000000Z"
						}
						s.interval && (B += ";INTERVAL=" + s.interval), s.count && (B += ";COUNT=" + s.count), s.byday && s.byday.length > 0 && (B += ";BYDAY=" + s.byday.join(","))
					}(new Date).toISOString();
					var H = ["BEGIN:VEVENT", "UID:" + n.length + "@" + e, "CLASS:PUBLIC", "DESCRIPTION:" + i, "DTSTAMP;VALUE=DATE-TIME:" + m, "DTSTART;VALUE=DATE-TIME:" + C, "DTEND;VALUE=DATE-TIME:" + j, "LOCATION:" + o, "SUMMARY;LANGUAGE=en-us:" + t, "TRANSP:TRANSPARENT", "END:VEVENT"];
					return B && H.splice(4, 0, B), H = H.join(r), n.push(H), H
				},
				download: function (e, t) {
					if (n.length < 1) return !1;
					t = void 0 !== t ? t : ".ics", e = void 0 !== e ? e : "calendar";
					var a, l = i + r + n.join(r) + o;
					if (-1 === navigator.userAgent.indexOf("MSIE 10")) a = new Blob([l]);
					else {
						var u = new BlobBuilder;
						u.append(l), a = u.getBlob("text/x-vCalendar;charset=" + document.characterSet)
					}
					return saveAs(a, e + t), l
				},
				build: function () {
					return !(n.length < 1) && i + r + n.join(r) + o
				}
			}
		}
		console.log("Unsupported Browser")
	}
};

// 4TB3 Added function to only display the iCalendar formatted output without downloading 2021.03.17
function viewOnly(obj) {
	if (!inputGood)
	alert('iCalendar File Preview\n*Note*: This file contains errors. Please check your input.\n=================\n' + obj.calendar());
	else
	alert('iCalendar File Preview\n=================\n' + obj.calendar());	
}