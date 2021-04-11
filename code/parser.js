// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter.
// Open index.html in a web browser for demo page. The resources directory contains supporting files/frameworks/libraries.
// This program makes use of the following open source libraries and frameworks: ics.js, pure.io.
// ==========================================================

// Global variables
var eventSummary, eventBegin, eventEnd, eventDescription // Vars for event field data
var inputGood // Whether user's input is acceptable
var allDay // Track whether event is an all-day event (no time specified)

// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b"
var relativeDate = "\\b(tom(?:orrow)?|tmrw|today|next|this)\\b"
var dateTimeRange = "\\b((-)|(to)|(and))\\b" //no spaces needed b/c \\b

// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	// Get user's input from textbox and initialize global variables
	var userInput = document.getElementById("userInput").value;
	inputGood = 1; // Initially assume user's input is acceptable
	allDay = 1; // And that the event is an all-day event
	
	if (userInput) // Hide live output area if input is empty
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
	splitSummaryDate(splitted[0])
	
	return;
}

// Split the summary and date
// DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange
function splitSummaryDate(input){
	
	// A separator can be found for Summary and DateTime
	var summaryDateSeparator = false;
	var splitted;
	
	// (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime
	if (input.search(' on ') >= 0){
		summaryDateSeparator = true;
		splitted = input.split(' on ')
		if (input.match(relativeDate)){
			parseRelativeDateTime(splitted[1])
			} else {
			eventBegin = parseAbsoluteDateTime(splitted[1])
			eventEnd = parseAbsoluteDateTime(splitted[1])
			// If not all day event, then set end time 1 hr after start time
			allDay === 0 ? eventEnd.setHours(eventEnd.getHours() + 1) : null;
		}
		} else if (input.search(' by ') >= 0){
		summaryDateSeparator = true;
		splitted = input.split(' by ')
		if (input.match(relativeDate)){
			parseRelativeDateTime(splitted[1])
			} else {
			eventBegin = parseAbsoluteDateTime(splitted[1])
			eventEnd = parseAbsoluteDateTime(splitted[1])
			allDay === 0 ? eventEnd.setHours(eventEnd.getHours() + 1) : null;
		}
	}
	
	// ('from' | 'between') DateTimeRange
	if (input.search(' from ') >= 0 ) {
		summaryDateSeparator = true;
		splitted = input.split(' from ');
		parseDateTimeRange(splitted[1]);
		} else if (input.search(' between') >= 0) {
		summaryDateSeparator = true;
		splitted = input.split(' between ');
		parseDateTimeRange(splitted[1]);
	}
	
	console.log(eventBegin)
	console.log(eventEnd)
	
	// If no summary-date separator in input, error
	if (summaryDateSeparator === false) {
		eventSummary = input;
		eventBegin = error("Could not find summary-date separator (Error S1)");
		eventEnd = "No date or time";
		return
	}
	
	eventSummary = splitted[0]
	
	// Store notices if certain fields are missing from input
	if (!eventSummary)
	eventSummary = "Untitled Event"	
	if (!eventBegin)
	eventBegin = "No date or time"
	if (!eventEnd)
	eventEnd = "No date or time"
}

// AbsoluteDateTime -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) ['at' (AbsoluteTime | RelativeTime)]
function parseAbsoluteDateTime(input){
	// If date is missing altogether, reject
	if (!input || input == " ")
	return error("Could not find a date value (Error D1)")
	
	
	const referenceDate = new Date(); // Reference Date
	var date = new Date(); // Date Time to modify
	
	var splitted = input.split(' at ');
	if (splitted.length === 1){
		allDay = 1
		} else {
		allDay = 0
	}
	
	
	// Check useragent to see if Firefox/Chromium due to differences between browsers in date() implementation. Unfortuantely unavoidable.
	if (navigator.userAgent.indexOf("Firefox") != -1 ) {
		// Try to initially create a Date Time object using input as-is
		var dateAttempt = new Date(input);
		if (dateAttempt != 'Invalid Date') {
			// Add time
			allDay === 0 ? date = timeDecision(dateAttempt, splitted[1]) : date = dateAttempt
			return date
		}
		
		// If fail, add current year and retry (in case user entered MM/DD)
		dateAttempt = new Date(input + " " + referenceDate.getFullYear());
		if (dateAttempt != 'Invalid Date') {
			// If successful, check to see if the date has already passed this year, and if so, change year to next year
			if (dateAttempt < referenceDate)
			dateAttempt.setFullYear(referenceDate.getFullYear() + 1);
			
			
			// Add time
			allDay === 0 ? date = timeDecision(dateAttempt, splitted[1]) : date = dateAttempt
			return date
		}
	}
	else if(navigator.userAgent.indexOf("Chrome") != -1) { // Chromium/Webkit
		// Try to initially create a Date Time object using input as-is
		var dateAttempt = new Date(input);
		
		if (dateAttempt != 'Invalid Date') {
			if (dateAttempt < referenceDate) {
				dateAttempt.setFullYear(referenceDate.getFullYear());
				if (dateAttempt != 'Invalid Date')
				if (dateAttempt < referenceDate)
				dateAttempt.setFullYear(referenceDate.getFullYear() + 1);
				
				
			}
			// Add time
			allDay === 0 ? date = timeDecision(dateAttempt, splitted[1]) : date = dateAttempt
			return date
		}
	}
	else { // For other browsers incl Safari
		// Try to initially create a Date Time object using input as-is
		var dateAttempt = new Date(input);
		
		if (dateAttempt != 'Invalid Date') {
			if (dateAttempt < referenceDate) {
				dateAttempt = new Date(input + " " + referenceDate.getFullYear());
				if (dateAttempt != 'Invalid Date')
				if (dateAttempt < referenceDate)
				dateAttempt.setFullYear(referenceDate.getFullYear() + 1);
				
				
			}
			// Add time
			allDay === 0 ? date = timeDecision(dateAttempt, splitted[1]) : date = dateAttempt
			return date
		}
		else
		// If fail, add current year and retry (in case user entered MM/DD)
		dateAttempt = new Date(input + " " + referenceDate.getFullYear());
		if (dateAttempt != 'Invalid Date') {
			// If successful, check to see if the date has already passed this year, and if so, change year to next year
			if (dateAttempt < referenceDate)
			dateAttempt.setFullYear(referenceDate.getFullYear() + 1);
			
			// Add time
			allDay === 0 ? date = timeDecision(dateAttempt, splitted[1]) : date = dateAttempt
			return date
		}
	}
	
	// If no good, try to parse it as a relative date
	dayMatchArray = input.toLowerCase().match(regExDayofWeek);	
	if (dayMatchArray)
	return setDateByDayOfWeek(date, dayMatchArray, referenceDate);
	else
	return error("Could not parse <i>" + input + "</i> as a date (Error D2)"); // Date is unrecognizable
}


// Recognizes relative date strings from input and creates date object
// RelativeDateTime -> RelativeDate [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
function parseRelativeDateTime(input){
	
	endDateType = "relative"; // Set date type abs -> rel
	var date = new Date(); // Date Time to modify
	const referenceDate = new Date(); // Reference Date
	
	relativeDateMatch = input.match(relativeDate)[0].toLowerCase();
	
	if (relativeDateMatch.match('\\b(tom(?:orrow)?|tmrw)\\b')){
		console.log("Matched tomorrow");
		date.setDate(date.getDate() + 1);
	} 
	else if (relativeDateMatch.match('\\b(today)\\b')){
		console.log("Matched today");
		date.setHours(date.getHours() + 2);
	} 
	else if (relativeDateMatch === 'this') {
		dayMatchArray = input.match(regExDayofWeek)
		console.log(dayMatchArray);
		date = setDateByDayOfWeek(date, dayMatchArray, referenceDate);
	} 
	else if (
		relativeDateMatch === 'next'){
		dayMatchArray = input.match(regExDayofWeek)
		console.log(dayMatchArray);
		date = setDateByDayOfWeek(date, dayMatchArray, referenceDate);
		date.setDate(date.getDate() + 7);
	}
	
	// [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
	var splitted;
	if (input.search('at') >= 0){
		splitted = input.split(' at ')
		date = timeDecision(date, splitted[1])
		} else if (input.search('in the') >= 0){
		splitted = input.split(' in the ')
		console.log(splitted[1])
		date = timeDecision(date, splitted[1])
	}
	eventBegin = date;	
	eventEnd = new Date(date);
	allDay === 0 ? eventEnd.setHours(eventEnd.getHours() + 1) : null;
	return;
}

// DateTimeRange -> AbsoluteDateTime ('-' | ' to ' | ' and ') AbsoluteDateTime
function parseDateTimeRange(input){
	
	// Match the regex and split on that match
	rangeMatch = input.match(dateTimeRange);
	splitted = input.split(rangeMatch[0]);
	
	// Parse both dates
	eventBegin = parseAbsoluteDateTime(splitted[0]);
	eventEnd = parseAbsoluteDateTime(splitted[1]);
	
	// Ensure end date is after start date.
	if (eventBegin > eventEnd){
		eventEnd = error("<i>" + formatDate(eventEnd) + "</i> precedes start date (Error D3)");
	}
	
	return;
}

function setDateByDayOfWeek(date, dayMatchArray, referenceDate){	
	endDateType = "relative"; // Set date type abs -> rel
	dayOfWeek = dayMatchArray[0].toLowerCase();
	
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
	return error("Could not parse <i>" + dayOfWeek + "</i> as a relative date (Error D3)") // Should not occur since input is checked against regex beforehand
	else if (numberOfWeek > referenceDate.getDay())
	date.setDate(date.getDate() + (numberOfWeek - date.getDay())) // Input is an upcoming day this week
	else
	date.setDate(date.getDate() + 7 - (date.getDay() - numberOfWeek)) // Input is an upcoming day next week
	
	return date;
}

// Sets the time depending on input
function timeDecision(date, input) {
	
	allDay = 0;
	
	// AbsoluteTime -> MonthNumber ('am'| 'pm')
	if (input.search('am') >= 0){
		var splitted = input.split(' am');
		console.log(splitted);
		date.setHours(parseInt(splitted[0]), 0, 0);
		return date;
		} else if (input.search('pm') >= 0){
		var splitted = input.split(' pm');
		date.setHours(parseInt(splitted[0]) + 12, 0, 0);
		return date;
	}
	
	// RelativeTime -> Morning | Afternoon | Evening | Night
	if (input.toLowerCase().search('morning') >= 0){
		date.setHours(9, 0, 0);
		return date;
		} else if (input.toLowerCase().search('afternoon') >= 0){
		date.setHours(13, 0, 0);
		return date;
		} else if (input.toLowerCase().search('evening') >= 0){
		date.setHours(17, 0, 0);
		return date;
		} else if (input.toLowerCase().search('night') >= 0){
		date.setHours(21, 0, 0)
		return date;
	}
	
	return "Error in Time"
}


// Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {
	// Rerun converter to refresh variables then build the iCalendar file using ics.js library and parsed data. 
	liveUpdate();
	
	// If all-day event, set end date to be midnight of the day after the user's entered end day (per iCal spec). Try catch since var can contain non-date value
	// Don't remove try catch or else typeerror when eventEnd contains error str rather than date obj
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
	
	if (formatDate(eventBegin) == formatDate(eventEnd)) //If start and end times are identical, just show one date field
	output = output + '<li id="output-date-single">Event Date: <span class="output">' + formatDate(eventBegin) +
	'</span></li>';
	else
	output = output + '<li id="output-date-start">Date Start: <span class="output">' + formatDate(eventBegin) +
	'</span></li>';
	
	if (formatDate(eventBegin) != formatDate(eventEnd))	
	if (eventEnd != "No date or time")
	output = output + '<li id="output-date-end">Date End: <span class="output">' + formatDate(eventEnd) + 
	'</span></li>';	
	
	if (eventDescription != "No description")
	output = output + '<li id="output-desc">Description: <span class="output">' + eventDescription + 
	'</span></li>';
	else
	output = output + '<li id="output-desc">Description: ' + eventDescription + 
	'</li>';
	
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