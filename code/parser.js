// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter.
// Open index.html in a web browser for demo page. The resources directory contains supporting files/frameworks/libraries.
// This program makes use of the following open source libraries and frameworks: ics.js, pure.io.
// ==========================================================

// Global variables
var eventSummary, eventBegin, eventEnd, eventDescription; // Vars for event field data
var inputGood; // Whether user's input is acceptable
var allDay; // Track whether event is an all-day event (no time specified)

// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b";
var relativeDate = "\\b(tom(?:orrow)?|tmrw|today|next|this)\\b";
var dateTimeRange = "\\b((-)|(to)|(and))\\b"; //no spaces needed b/c \\b


// Function to enter some sample text for manual testing/demo
var i = 0;
var txt;
var speed = 10;

function sampleInput(testNum) {	
	var testStrings = ['Complete project by Wed Apr 14 at 9:30 pm. Submit everything on Gitlab',
		'Project presentations from April 3 to April 6. Prepare slides',
		'Group meeting on next tues at 11:15 am',
		'This is an invalid input because there is no date or time.',
		'This is also invalid from Appr 27 8:23 pm to mon at 2a2:03 pm. Due to bad date values',
	'This is no good either between 1/31-12/30. Because of the invalid date range'];
	
	i = 0;
	document.getElementById("userInput").value = "";
	txt = testStrings[testNum - 1];
	typeWriter();
	return;
}
function typeWriter() {
	if (i < txt.length) {
		document.getElementById("userInput").value += txt.charAt(i);
		i++;
		setTimeout(typeWriter, speed);
		liveUpdate();
	}
}


// Function to enter some sample text for manual testing/demo
// function sampleInput(testNum) {	
	// var testStrings = ['Complete project by Wed Apr 14 at 9:30 pm. Submit everything on Gitlab',
		// 'Project presentations from April 3 to April 6. Prepare slides',
		// 'Group meeting on next tuesday at 11:15 am',
		// 'This is an invalid input because there is no date or time.',
		// 'This is also invalid from Appr 27 8:23 pm to mon at 2a2:03 pm. Due to bad date values',
	// 'This is no good either between 1/31-12/30. Because of the invalid date range'];
	
	// document.getElementById('userInput').value = testStrings[testNum - 1];
	// liveUpdate();
	// return;
// }


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

// Split input string at "."
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
	
	console.log(eventBegin);
	console.log(eventEnd);
	
	// If no summary-date separator in input, error
	if (summaryDateSeparator == false) {
		eventSummary = input;
		eventBegin = eventEnd = error("Could not find summary-date separator (Error S1)");
		return;
	}
	
	eventSummary = splitted[0];
	
	// Store notices if certain fields are missing from input
	if (!eventSummary)
	eventSummary = "Untitled Event";
	if (!eventBegin)
	eventBegin = "No date or time";
	if (!eventEnd)
	eventEnd = "No date or time";
	if (eventBegin.toString().search('Invalid Date') >= 0 )
	eventBegin = error("Could not parse date-time value (Error T5)");
	if (eventEnd.toString().search('Invalid Date') >= 0 )
	eventEnd = error("Could not parse date-time value (Error T5)");
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
	// alert(dateAttempt.getFullYear())
	if ((date == 'Invalid Date') || (date.getFullYear() < 2002)) {
		console.log("Trying to parse date as-provided failed:\n" + splitted[0] + " -> " + date);
		
		// If can't parse as-provided, insert current year and retry (in case user entered 01/23 or Jan 23 with implied year)
		date = new Date(splitted[0] + " " + referenceDate.getFullYear());
		
		// Adding year and parsing was successful if the input had at least one digit and the output is a valid date.
		// Now check to see if the date has already passed this year, and if so, change implied year to be next year
		if (date != 'Invalid Date' && (/\d/.test(splitted[0]))) {
			console.log("Trying with current year added worked:\n" + splitted[0] + " " + referenceDate.getFullYear() + " -> " + date);
			if (date < referenceDate) {
				date.setFullYear(referenceDate.getFullYear() + 1);
				console.log("But that date has passed, so assuming next year:\n" + date);
			}
		}
		else {
			// If adding implied year still didn't work, try to parse input as a relative date instead (tomorrow, friday, etc)
			console.log("Trying with current year added also failed:\n" + splitted[0] + " " + referenceDate.getFullYear() + " -> " + date);
			
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
	
	if (input.match('\\b(tom(?:orrow)?|tmrw)\\b')) {
		console.log("Matched tomorrow");
		date.setDate(date.getDate() + 1);
	} 
	else if (input.match('\\b(today)\\b')) {
		console.log("Matched today");
		date.setHours(date.getHours() + 2);
	} 
	else if (input.match('\\b(this)\\b')) {
		dayMatchArray = input.match(regExDayofWeek)
		console.log(dayMatchArray);
		try { date = setDateByDayOfWeek(date, dayMatchArray, referenceDate); }
		catch { eventBegin = error("Could not parse <i>" + input + "</i> as a relative date (Error D4)"); return }
	} 
	else if (input.match('\\b(next)\\b')) {
		dayMatchArray = input.match(regExDayofWeek)
		console.log(dayMatchArray);
		try { date = setDateByDayOfWeek(date, dayMatchArray, referenceDate); }
		catch { eventBegin = error("Could not parse <i>" + input + "</i> as a relative date (Error D4)"); return }
		date.setDate(date.getDate() + 7);
	}
	
	// [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
	var splitted;
	
	if (input.search(' at ') >= 0) {
		splitted = input.split(' at ');
		date = timeDecision(date, splitted[1]);
	} 
	else if (input.search(' in the ') >= 0) {
		splitted = input.split(' in the ');
		console.log(splitted[1]);
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
	// Match the regex and split on that match
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
function setDateByDayOfWeek(date, dayMatchArray, referenceDate) {
	dayOfWeek = dayMatchArray[0].toLowerCase();	
	var date = new Date(); // Date Time to modify
	
	// Match day of week from input w/ regex
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
	allDay = 0;
	
	try { input = input.toLowerCase(); }
	catch { return error("Could not parse <i>" + input + "</i> as date with time (Error T4)") }
	var parsedTime;
	
	// AbsoluteTime -> MonthNumber ('am'| 'pm')
	if (input.search('am') >= 0) {
		parsedTime = input.split('am');
		
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
		try { date.setHours(parseInt(parsedTime[0]) + ((parsedTime[0] == 12) ? 12 : 0), 0, 0); }
		catch { return "Could not parse <i>" + input + "</i> as time (Error T1)"; }
		
		// If minutes were provided, parse
		if (parsedTime[1]) {
			if ((parsedTime[1] < 0) || (parsedTime[1] > 59))
			return error("Minute value of time <i>" + input + "</i> not in expected range (Error T8)");
			try { date.setMinutes(parseInt(parsedTime[1])); }
			catch { return error("Could not parse <i>" + input + "</i> as time (Error T1)"); }
		}
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
			return error("Minute value of time <i>" + input + "</i> not in expected range (Error T2)");
			try { date.setMinutes(parseInt(parsedTime[1])); }
			catch { return error("Could not parse <i>" + input + "</i> as time (Error T1)"); }
		}
		return date;
	}
	
	// RelativeTime -> Morning | Afternoon | Evening | Night
	if (input.search('morning') >= 0) {
		date.setHours(9, 0, 0);
		return date;
	} 
	else if (input.search('afternoon') >= 0) {
		date.setHours(13, 0, 0);
		return date;
	} 
	else if (input.search('evening') >= 0) {
		date.setHours(17, 0, 0);
		return date;
	} 
	else if (input.search('night') >= 0) {
		date.setHours(21, 0, 0);
		return date;
	}
	
	// Error if time parsing failed (For inputs like "Something on tuesday at 11:30 fm")
	return error("Could not parse <i>" + input + "</i> as time (Error T1)") 
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
		if (inputGood) // Download only if the input was acceptable
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
		document.getElementById("helpText").innerHTML = 'Press Enter or click Download to generate an iCalendar file for your event.';
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


// Format date and time in en-US locale (try catch required since variable may contain non-date object) 
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

// Format error strings in red and mark input as no good
function error(errorString) {
	inputGood = 0; // Mark user input as unacceptable once error occurs
	
	// Format HTML error msg with CSS class
	if (!errorString) // If blank argument received, use default error message
	errorString = 'Sorry, an unknown error occurred (You should never see this)';
	return '<span class="output-error">' + errorString + '</span>';;
}

// Automatically fills input using URL parameter and generates file immediately
// (usage: /index.html?q=Do something on Friday      --Download .ics upon page load
//         /index.html?q=Do something on Friday&p    --Preview .ics upon page load)
function onLoad() {
	// Get the input string from URL
	const urlParams = new URLSearchParams(window.location.search);
	const inputString = urlParams.get('q');
	const previewOnly = urlParams.get('p');
	
	// Enter input into textbox and update the page
	document.getElementById('userInput').value = inputString; 
	liveUpdate();
	
	// Preview only if "&p" argument is also present, otherwise download
	if (inputString)
	generateICS((previewOnly != null) ? 0 : 1);
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
	getEventBegin,
	getEventEnd,
	getEventDescription,
	getEventSummary
}	