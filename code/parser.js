// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter.
// Open index.html in a web browser for demo page. The resources directory contains supporting files/frameworks/libraries.
// This program makes use of the following open source libraries and frameworks: ics.js, purecss.io.
// ==========================================================

// Global variables
var eventSummary, eventBegin, eventEnd, eventDescription; // Vars for parsed event field data
var inputGood; // Whether user's input is acceptable
var allDay; // Track whether event is an all-day event (no time specified)

// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b";
var relativeDate = "\\b(tom(?:orrow)?|tmrw|today|next|this)\\b";
var dateTimeRange = "\\b((-)|(to)|(and))\\b";

// Global Constants
const defaultTimeMorning = 9;;
const defaultTimeAfternoon = 13;
const defaultTimeEvening = 17;
const defaultTimeNight = 21;


// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	// Get user's input from textbox and initialize global variables
	var userInput = document.getElementById("userInput").value;
	inputGood = 1; // Initially assume user's input is acceptable
	allDay = 1; // And that the event is an all-day event
	
	// Hide live output area if input is empty
	document.getElementById("output").hidden = (userInput) ? false : true;
	
	// Call parsing functions
	splitAtPeriod(userInput);
	
	// Display returned value on page
	document.getElementById("liveOutput").innerHTML = formatHTML(eventSummary, eventBegin, eventEnd, eventDescription);
}

// Split input string at ". "
// S -> Summary DateTime [". " Description]
function splitAtPeriod(input) {
	
	// Split description from rest of input	
	splitted = input.split('. ');
	splitted[1] ? eventDescription = splitted[1] : eventDescription = "No description"; 
	splitSummaryDate(splitted[0]);
	
	return;
}

// Split the summary and date
// DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange
function splitSummaryDate(input) {
	
	// A separator can be found for Summary and DateTime
	var summaryDateSeparator = false;
	var splitted;
	
	// Don't match upper case separators since they can be abbrev/initials (ie "Complete project for McMaster University in Hamilton, ON by Monday")
	
	// (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime
	if (input.search(' on ') >= 0) {
		summaryDateSeparator = true;
		splitted = input.split(' on ')
		if (input.match(relativeDate)) {
			parseRelativeDateTime(splitted[1]);
		}
		else {
			eventBegin = parseAbsoluteDateTime(splitted[1])
			eventEnd = parseAbsoluteDateTime(splitted[1])
			// If not all day event, then set end time 1 hr after start time
			if (allDay == 0)
			try { allDay == 0 ? eventEnd.setHours(eventEnd.getHours() + 1) : null; }
			catch { eventEnd = error("Could not compute due to invalid start date (Error T3)"); }
		}
	} 
	else if (input.search(' by ') >= 0) {
		summaryDateSeparator = true;
		splitted = input.split(' by ')
		if (input.match(relativeDate)) {
			parseRelativeDateTime(splitted[1]);
		} 
		else {
			eventBegin = parseAbsoluteDateTime(splitted[1]);
			eventEnd = parseAbsoluteDateTime(splitted[1]);
			if (allDay == 0)
			try { allDay == 0 ? eventEnd.setHours(eventEnd.getHours() + 1) : null; }
			catch { eventEnd = error("Could not compute due to invalid start date (Error T3)"); }
		}
	}
	
	// ('from' | 'between') DateTimeRange
	if (input.search(' from ') >= 0 ) {
		summaryDateSeparator = true;
		splitted = input.split(' from ');		
		try { parseDateTimeRange(splitted[1]); }
		catch { eventEnd = error("Could not find date range separator (Error S2)"); }
	}
	else if (input.search(' between') >= 0) {
		summaryDateSeparator = true;
		splitted = input.split(' between ');
		try { parseDateTimeRange(splitted[1]);}
		catch { eventEnd = error("Could not find date range separator (Error S2)"); }
	}
	
	// If no summary-date separator in input, error
	if (!summaryDateSeparator) {
		eventSummary = input;
		eventBegin = eventEnd = error("Could not find summary-date separator (Error S1)");
		return;
	}	
	eventSummary = splitted[0];
	
	// Final output date error checks	
	if (eventBegin.toString().search('Invalid Date') >= 0 )
	eventBegin = error("Could not parse date-time value (Error T5)");
	if (eventEnd.toString().search('Invalid Date') >= 0 )
	eventEnd = error("Could not parse date-time value (Error T5)");
	
	// Store notices if certain fields are missing from input
	if (!eventSummary)
	eventSummary = "Untitled Event";
	if (!eventBegin)
	eventBegin = "No date or time";
	if (!eventEnd)
	eventEnd = "No date or time";
}

// AbsoluteDateTime -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) ['at' (AbsoluteTime | RelativeTime)]
function parseAbsoluteDateTime(input) {
	
	// If date is missing altogether, reject
	if (!input || input == " ")
	return error("Could not find a date value (Error D1)");
	
	const referenceDate = new Date(); // Reference Date
	var date = new Date(); // Date Time to modify
	
	var splitted = input.split(' at ');
	allDay = splitted.length == 1 ? 1 : 0;
	
	// Try to initially create a Date Time object using input as-is (assume user has provided full date incl year)
	var date = new Date(splitted[0]);
	if ((date == 'Invalid Date') || (date.getFullYear() < 2002)) { // Workaround for Chromium-based browsers defaulting to 2001/2002 without explicit year
		console.log("Trying to parse date as-provided failed:\n" + splitted[0] + " -> " + date);
		
		// If can't parse as-provided, insert current year and retry (in case user entered 01/23 or Jan 23 with implied year)
		date = new Date(splitted[0] + " " + referenceDate.getFullYear());
		
		// Adding year and parsing was successful if the input had at least one digit and the output is a valid date.
		// Now check to see if the date has already passed this year, and if so, change implied year to be next year
		if (date != 'Invalid Date' && (/\d/.test(splitted[0]))) {
			console.log("Trying with implied current year added worked:\n" + splitted[0] + " " + referenceDate.getFullYear() + " -> " + date);
			if (date < referenceDate) {
				date.setFullYear(referenceDate.getFullYear() + 1);
				console.log("But that date has passed, so assuming next year:\n" + date);
			}
		}
		else {
			// If adding implied year still didn't work, try to parse input as a relative date instead (tomorrow, friday, etc)
			console.log("Trying with implied current year added also failed:\n" + splitted[0] + " " + referenceDate.getFullYear() + " -> " + date);			
			dayMatchArray = splitted[0].toLowerCase().match(regExDayofWeek);	
			if (dayMatchArray)
			date = setDateByDayOfWeek(splitted[0], dayMatchArray, referenceDate);
			else
			return error("Could not parse <i>" + input + "</i> as a date (Error D2)"); // Date is unrecognizable
		}
	}
	
	// If a time value is also provided, parse that separately and return.
	if (allDay == 0)
	date = timeDecision(date, splitted[1]);
	return date;
}


// Recognizes relative date strings from input and creates date object
// RelativeDateTime -> RelativeDate [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
function parseRelativeDateTime(input) {
	var date = new Date(); // Date Time to modify
	const referenceDate = new Date(); // Reference Date	
	input = input.toLowerCase();
	
	// Pattern match relative date keywords
	if (input.match('\\b(tom(?:orrow)?|tmrw)\\b')) {
		console.log("Matched tomorrow");
		date.setDate(date.getDate() + 1);
	} 
	else if (input.match('\\b(today)\\b')) {
		console.log("Matched today");
		date.setDate(date.getDate());
	} 
	// Pattern match relative date modifier keywords
	else if (input.match('\\b(this)\\b')) {
		dayMatchArray = input.match(regExDayofWeek)
		try { date = setDateByDayOfWeek(date, dayMatchArray, referenceDate); }
		catch { eventBegin = error("Could not parse <i>" + input + "</i> as a relative date (Error D4)"); return }
	} 
	else if (input.match('\\b(next)\\b')) {
		dayMatchArray = input.match(regExDayofWeek)
		try { date = setDateByDayOfWeek(date, dayMatchArray, referenceDate); }
		catch { eventBegin = error("Could not parse <i>" + input + "</i> as a relative date (Error D4)"); return }
		date.setDate(date.getDate() + 7); // Add 7 days to date for next week
	}
	
	// [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
	var splitted;
	// Scan for date-time separator keywords and parse time separately
	if (input.search(' at ') >= 0) {
		splitted = input.split(' at ');
		date = timeDecision(date, splitted[1]);
	} 
	else if (input.search(' in the ') >= 0) {
		splitted = input.split(' in the ');
		date = timeDecision(date, splitted[1]);
	}
	eventBegin = date;
	eventEnd = new Date(date);
	if (allDay == 0)
	eventEnd.setHours(eventEnd.getHours() + 1);
	return;
}

// DateTimeRange -> AbsoluteDateTime ('-' | ' to ' | ' and ') AbsoluteDateTime
function parseDateTimeRange(input) {	
	// Pattern match date range separator keywords w/ regex and parse two dates separately
	rangeMatch = input.match(dateTimeRange);
	splitted = input.split(rangeMatch[0]);
	
	// Parse both dates
	eventBegin = parseAbsoluteDateTime(splitted[0]);
	eventEnd = parseAbsoluteDateTime(splitted[1]);
	
	// Ensure end date is after start date. (compare only when both vars contain date object)
	if ((eventBegin > eventEnd) && ((typeof(eventBegin)) == "object") && ((typeof(eventEnd)) == "object"))
	eventEnd = error("<i>" + formatDate(eventEnd) + "</i> precedes start date (Error D3)");
	return;
}

// Parses day of week name from input, returns date of closest upcoming matching day 
// DayOfWeek -> 'Mon' [ 'day' ] | ... | 'Sun' [ 'day' ]
function setDateByDayOfWeek(date, dayMatchArray, referenceDate) {
	dayOfWeek = dayMatchArray[0].toLowerCase();	
	var date = new Date(); // Date Time to modify
	
	// Pattern match day of week from input w/ regex
	// DayOfWeek -> 'Mon' ['day'] | ... | 'Sun' ['day']
	if (dayOfWeek.match('\\b(sun)(?:day)?\\b'))
	numberOfWeek = 0;
	else if (dayOfWeek.match('\\b(mon)(?:day)?\\b'))
	numberOfWeek = 1;
	else if (dayOfWeek.match('\\b(tue(?:s)?)(?:day)?\\b'))
	numberOfWeek = 2;
	else if (dayOfWeek.match('\\b(wed(?:nes)?)(?:day)?\\b'))
	numberOfWeek = 3;
	else if (dayOfWeek.match('\\b(thu(?:rs?)?)(?:day)?\\b'))
	numberOfWeek = 4;
	else if (dayOfWeek.match('\\b(fri)(?:day)?\\b'))
	numberOfWeek = 5;
	else if (dayOfWeek.match('\\b(sat(?:ur)?)(?:day)?\\b'))
	numberOfWeek = 6;
	else
	numberOfWeek = -1;	
	
	// Create date object for matched day of week
	if (numberOfWeek == -1)
	return error("Could not parse <i>" + dayOfWeek + "</i> as a relative date (Error D5)"); // Should not occur since input is checked against regex beforehand
	else if (numberOfWeek > referenceDate.getDay())
	date.setDate(date.getDate() + (numberOfWeek - date.getDay())); // Input is an upcoming day this week
	else
	date.setDate(date.getDate() + 7 - (date.getDay() - numberOfWeek)); // Input is an upcoming day next week	
	return date;
}

// Sets the time depending on input
function timeDecision(date, input) {
	try { input = input.toLowerCase(); }
	catch { return error("Could not parse <i>" + input + "</i> as date with time (Error T4)") }
	var parsedTime;	
	allDay = 0; // If time is provided, no longer an all-day event
	
	// AbsoluteTime -> HourTime [ ':' MinuteTime] [ ' ' ] ( 'am'| 'pm' )
	if (input.search('am') >= 0) {
		parsedTime = input.split('am');
		
		// Test for invalid characters in time w/regex
		if (/[a-zA-Z]/.test(parsedTime[0]))
		return error("Time <i>" + input + "</i> is invalid or contains unexpected characters (Error T6)");	
		
		// Scan for optional colon and split hour from minute if found
		if (parsedTime[0].search(':') >= 0)
		parsedTime = parsedTime[0].split(':');
		console.log(parsedTime)
		
		// Test to ensure time has an hour value and that it's valid
		if (!parsedTime[0] || parsedTime[0] == " ")
		return error("Time <i>" + input + "</i> is missing hour component (Error T7)");		
		
		if ((parsedTime[0] < 1) || (parsedTime[0] > 12))
		return error("Hour value of time <i>" + input + "</i> not in expected range (Error T2)");
		try { date.setHours(parseInt(parsedTime[0]) + ((parsedTime[0] == 12) ? -12 : 0), 0, 0); }
		catch { return "Could not parse <i>" + input + "</i> as time (Error T1)"; }
		
		// If minutes were provided, test and parse separately 
		if (!parsedTime[1] || parsedTime[1] == " ")
		parsedTime[1] = 0;
		if ((parsedTime[1] < 0) || (parsedTime[1] > 59))
		return error("Minute value of time <i>" + input + "</i> not in expected range (Error T8)");
		try { date.setMinutes(parseInt(parsedTime[1])); }
		catch { return error("Could not parse <i>" + input + "</i> as time (Error T1)"); }
		
		return date;
	} 
	else if (input.search('pm') >= 0) {
		parsedTime = input.split('pm');
		
		// Test for invalid chars in time
		if (/[a-zA-Z]/.test(parsedTime[0]))
		return error("Time <i>" + input + "</i> is invalid or contains unexpected characters (Error T6)");	
		
		if (parsedTime[0].search(':') >= 0)
		parsedTime = parsedTime[0].split(':');
		
		// Test to ensure time has hour value at minimum
		if (!parsedTime[0] || parsedTime[0] == " ")
		return error("Time <i>" + input + "</i> is missing hour component (Error T7)");		
		
		if ((parsedTime[0] < 1) || (parsedTime[0] > 12))
	return error("Hour value of time <i>" + input + "</i> not in expected range (Error T2)");
	try { date.setHours(parseInt(parsedTime[0]) + ((parsedTime[0] == 12) ? 0 : 12), 0, 0); }
	catch { return error("Could not parse <i>" + input + "</i> as time (Error T1)"); }
	
	// If minutes were provided, parse
	if (parsedTime[1]) {
		if ((parsedTime[1] < 0) || (parsedTime[1] > 59))
		return error("Minute value of time <i>" + input + "</i> not in expected range (Error T8)");
		try { date.setMinutes(parseInt(parsedTime[1])); }
		catch { return error("Could not parse <i>" + input + "</i> as time (Error T1)"); }
	}
	return date;
	}
	
	// RelativeTime -> 'morning' | 'noon' | 'afternoon' | 'evening' | 'night'​
	if (input.search('morning') >= 0) {
		date.setHours(defaultTimeMorning, 0, 0);
		return date;
	} 
	else if (input.search('afternoon') >= 0) {
		date.setHours(defaultTimeAfternoon, 0, 0);
		return date;
	} 
	else if (input.search('noon') >= 0) {
		date.setHours(12, 0, 0);
		return date;
	} 
	else if (input.search('evening') >= 0) {
		date.setHours(defaultTimeEvening, 0, 0);
		return date;
	} 
	else if (input.search('night') >= 0) {
		date.setHours(defaultTimeNight, 0, 0);
		return date;
	}
	
	// Error if time parsing failed (For inputs like "Something on tuesday at 11:30 fm")
	return error("Could not parse <i>" + input + "</i> as time (Error T1)") 
}

// Format date and time in en-US locale for liveOutput (try catch since variable may contain non-date object) 
function formatDate(date) {	
	if (allDay) {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		try {date = date.toLocaleDateString("en-US", options);}
		catch {}
	}
	else {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		try {date = date.toLocaleDateString("en-US", options) + ' ' + date.toLocaleTimeString();}
		catch {}
	}
	return date
}

// Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {
	// Rerun converter to refresh variables then build the iCalendar file using ics.js library and parsed data. 
	liveUpdate();
	
	// If all-day event, set end date to be midnight of the day after the user's entered end day (per iCal spec). Try catch since var can contain error strings
	if (allDay)
	try {eventEnd.setDate(eventEnd.getDate() + 1);}
	catch {}
	
	// If no description, use empty string for file rather than "No description"
	icalOutput = ics();
	icalOutput.addEvent(eventSummary, eventDescription == "No description" ? '' : eventDescription, '', formatDate(eventBegin), formatDate(eventEnd));
	
	// Give user the .ics or display the preview
	if (arg) {
		// Download only if the input was acceptable
		if (inputGood)
		icalOutput.download(eventSummary);
	}
	else
	viewOnly(icalOutput);
	return;
}

// Format live output HTML
function formatHTML(eventSummary, eventBegin, eventEnd, eventDescription) {	
	// Disable download button if the current input is unacceptable and update help text
	if (!inputGood) {
		document.getElementById("btnDownload").disabled = true;
		document.getElementById("helpText").innerHTML = '⚠️ Please fix the issues above to download your iCalendar file.';
	}
	else {
		document.getElementById("btnDownload").disabled = false; 
		document.getElementById("helpText").innerHTML = '✅ Press Enter or click Download to generate an iCalendar file for your event.';
	}
	
	// Return the parsed data in a user-friendly way for real-time display on page
	var output = '<li id="output-summary">Summary: <span class="output">' + eventSummary + 
	'</span></li>';	
	
	if (formatDate(eventBegin) == formatDate(eventEnd)) // If start and end times are identical, just show one date field
	output = output + '<li id="output-date-single">Event Date: <span class="output">' + formatDate(eventBegin) + '</span></li>';
	else
	output = output + '<li id="output-date-start">Date Start: <span class="output">' + formatDate(eventBegin) + '</span></li>';
	
	if (formatDate(eventBegin) != formatDate(eventEnd))	// If dates are different, show both fields
	if (eventEnd != "No date or time")
	output = output + '<li id="output-date-end">Date End: <span class="output">' + formatDate(eventEnd) + '</span></li>';	
	
	if (eventDescription != "No description") // Gray out description field if none provided
	output = output + '<li id="output-desc">Description: <span class="output">' + eventDescription + '</span></li>';
	else
	output = output + '<li id="output-desc">Description: ' + eventDescription + '</li>';
	
	return output
}

// Format error strings in red and mark input as no good
function error(errorString) {
	inputGood = 0; // Mark user input as unacceptable once error occurs
	
	// Format HTML error msg with CSS class
	if (!errorString) // If blank argument received, use default error message
	errorString = 'Sorry, an unknown error occurred (You should never see this)';
	return '<span class="output-error">' + errorString + '</span>';;
}


// Temporary: for automated testing during development
function getEventBegin() { return eventBegin; }
function getEventEnd() { return eventEnd; }
function getEventDescription() { return eventDescription; }
function getEventSummary() { return eventSummary; }

module.exports = {
	splitAtPeriod, 
	splitSummaryDate, 
	parseRelativeDateTime,
	parseDateTimeRange, 
	parseAbsoluteDateTime, 
	setDateByDayOfWeek,
	timeDecision,
	getEventBegin,
	getEventEnd,
	getEventDescription,
	getEventSummary
}
