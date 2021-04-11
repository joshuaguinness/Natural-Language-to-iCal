// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter.
// Open index.html in a web browser for demo page. The resources directory contains supporting files/frameworks/libraries.
// This program makes use of the following open source libraries and frameworks: ics.js, pure.io.
// ==========================================================

// Global variables
var eventSummary, eventBegin, eventEnd, eventDescription // Vars for event field data
var inputGood // Whether user's input is acceptable
var endDateType // Track whether relative or absolute dates in use
var allDay // Track whether event is an all-day event (no time specified)

// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b"
var relativeDate = "\\b(tom(?:orrow)?|tmrw|today|next|this)\\b"
var dateTimeRange = "\\b(-)|( to )|( and )\\b"

// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	// Get user's input from textbox and initialize global variables
	var userInput = document.getElementById("userInput").value;
	inputGood = 1; // Initially assume user's input is acceptable
	allDay = 1; // And that the event is an all-day event
	endDateType = "absolute" // And that the user is entering dates as absolute dates
	
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
function splitSummaryDate(input){
	
	// Split summary from rest of input
	if (input.search(' on ') > 0)
	var splitted = input.split(' on ');
	else if (input.search(' at ') > 0)
	var splitted = input.split(' at ');
	else if (input.search(' by ') > 0)
	var splitted = input.split(' by ');
	else if (input.search(' from ') > 0)
	var splitted = input.split(' from ');
	else if (input.search(' between') > 0)
	var splitted = input.split(' between ');
	else { // If no summary-date separator in input, error
		eventSummary = input;
		eventBegin = error("Could not find summary-date separator (Error S1)");
		eventEnd = "No date or time";
		return
	}
	
	eventSummary = splitted[0];
	parseDateTime(splitted[1]);	
	
	// Store notices if certain fields are missing from input
	if (!eventSummary)
	eventSummary = "Untitled Event";
	if (!eventBegin)
	eventBegin = "No date or time";
	if (!eventEnd)
	eventEnd = "No date or time";
	return
}

// Convert date/time from input into date object
function parseDateTime(input) {
	
	if (input.match(relativeDate))
	parseRelativeDateTime(input);
	else if (input.match(dateTimeRange))
	parseDateTimeRange(input);
	else {
		eventBegin = parseAbsoluteDateTime(input);
		eventEnd = parseAbsoluteDateTime(input);
		
		if (typeof eventEnd === Date)
		eventEnd.setHours(eventEnd.getHours() + 1); //Default event length is 1hr
	}
	return;
}

// Recognizes relative date strings from input and creates date object
function parseRelativeDateTime(input){
	
	endDateType = "relative"; // Set date type abs -> rel
	var date = new Date(); // Date Time to modify
	
	allDay = 1;
	
	relativeDateMatch = input.match(relativeDate)[0].toLowerCase();
	
	if (relativeDateMatch.match('\\b(tom(?:orrow)?|tmrw)\\b')){
		date.setDate(date.getDate() + 1);
		//date.setHours(9, 0, 0); // Default time to 9am
	} 
	else if (relativeDateMatch.match('\\b(today)\\b')){
		date.setHours(date.getHours() + 2);
	} 
	else if (relativeDateMatch === 'this') { //TODO This/Next modifiers aren't working.. or just remove if we run out of time...
		dayOfWeek = input.split('this ')[1];
		date = parseAbsoluteDateTime(dayOfWeek);
	} 
	else if (
		relativeDateMatch === 'next'){
		dayOfWeek = input.split('next ')[1];
		date = parseAbsoluteDateTime(dayOfWeek);
		date.setDate(date.getDate() + 7);
	}
	
	eventBegin = date;	
	eventEnd = date;
	eventEnd.setHours(eventEnd.getHours() + 1); //Default event length is 1hr	
	return;
}

// Split the Date Time Range at one of the keywords
function parseDateTimeRange(input){
	
	// Match the regex and split on that match
	rangeMatch = input.match(dateTimeRange);
	splitted = input.split(rangeMatch[0]);
	
	// Parse both dates
	eventBegin = parseAbsoluteDateTime(splitted[0]);
	eventEnd = parseAbsoluteDateTime(splitted[1]);
	
	// Ensure end date is after start date.
	if (eventBegin > eventEnd)
	if (endDateType == "relative")
	eventEnd.setDate(eventEnd.getDate() + 7)
	else
	eventEnd = error("<i>" + formatDate(eventEnd) + "</i> precedes start date (Error D3)");
	
	return;
}

function parseAbsoluteDateTime(input){
	// If date is missing altogether, reject
	if (!input || input == " ")
	return error("Could not find a date value (Error D1)")
	
	const referenceDate = new Date(); // Reference Date
	var date = new Date(); // Date Time to modify
	date.setHours(9, 0, 0); // Default time to 9am
	
	// Try to initially create a Date Time object using constructor
	var dateAttempt = new Date(input);
	if (dateAttempt != 'Invalid Date') {
		// If successful, check to see if date is in the past and adjust year if user didn't explicitly specify a prior year
		if ((dateAttempt < referenceDate) && (dateAttempt.getFullYear() == referenceDate.getFullYear()))
		dateAttempt.setFullYear(dateAttempt.getFullYear() + 1);
		return dateAttempt;
	}
	
	// If fail, add year and retry
	dateAttempt = new Date(input + " " + referenceDate.getFullYear());
	if (dateAttempt != 'Invalid Date') {
		// If successful, check to see if date is in the past and adjust year if user didn't explicitly specify a prior year
		if ((dateAttempt < referenceDate) && (dateAttempt.getFullYear() == referenceDate.getFullYear()))
		dateAttempt.setFullYear(dateAttempt.getFullYear() + 1);
		return dateAttempt;
	}
	
	// If no good, try to parse it as a relative date
	dayMatchArray = input.toLowerCase().match(regExDayofWeek);	
	if (dayMatchArray)
	date = setDateByDayOfWeek(date, dayMatchArray, referenceDate);
	else
	date = error("Could not parse <i>" + input + "</i> as a date (Error D2)"); // Date is unrecognizable
	
	return date
}

function setDateByDayOfWeek(date, dayMatchArray, referenceDate){	
	endDateType = "relative"; // Set date type abs -> rel
	dayOfWeek = dayMatchArray[0].toLowerCase();
	
	// Match day of week from input w/ regex
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

// Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {		
	// Build the iCalendar file using ics.js library and parsed data. 
	
	// If all-day event, set end date to be midnight of the day after the user's entered end day (per iCal spec).
	if (allDay)
	eventEnd.setDate(eventEnd.getDate() + 1);
	
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
	return '<li id="output-summary">Summary: <span class="output">' + eventSummary + 
	'</span></li><li id="output-date-start">Date Start: <span class="output">' + formatDate(eventBegin) +
	'</span></li><li id="output-date-end">Date End: <span class="output">' + formatDate(eventEnd) + 
	'</span></li><li id="output-desc">Description: <span class="output">' + eventDescription + 
	'</span></li>';
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
	generateICS((previewOnly != null) ? 0 : 1); 
}

// Temporary: for automated testing during development
module.exports = {
	eventSummary, 
	eventBegin, 
	eventEnd, 
	eventDescription, 
	splitAtPeriod, 
	splitSummaryDate, 
	parseDateTime, 
	parseRelativeDateTime,
	parseDateTimeRange, 
	parseAbsoluteDateTime, 
	setDateByDayOfWeek, 
	generateICS
}