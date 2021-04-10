// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter
// Open index.html in a web browser for demo webpage. The resources directory contains supporting files/framework/libraries
//
// This program makes use of the following open source libraries and frameworks: ics.js, pure.io
//
// ==========================================================

// Global variables
var eventSummary, eventBegin, eventEnd, eventDescription // Vars for event field data
var inputGood // Whether user's input is acceptable


// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b"
var regExMonth = "\\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\b"
var relativeDate = "((?:next|last|this) (?:week|month|year)|tom(?:orrow)?|tmrw|tod(?:ay)?|(?:right )?now|tonight|day after (?:tom(?:orrow)?|tmrw)|yest(?:erday)?|day before yest(?:erday)?)|this|next"
var dateTimeRange = "(-)|(to)|(and)"

// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	// Get user's input from textbox and initially assume it's acceptable
	var userInput = document.getElementById("userInput").value;
	inputGood = 1;
	
	if (userInput) // Hide live output area if input is empty
	document.getElementById("output").hidden = false;
	else
	document.getElementById("output").hidden = true;
	
	// Call parsing functions
	splitAtPeriod(userInput);
	
	// Display returned value on page
	document.getElementById("liveOutput").innerHTML = formatHTML(eventSummary, eventBegin, eventEnd, eventDescription);
}

// Split input string at "."
// S -> Summary DateTime ["." Description]
function splitAtPeriod(input) {
	
	// Split description from rest of input	at "." if exists
	splitted = input.split('. ');
	splitted[1] ? eventDescription = splitted[1] : eventDescription = "No description"; 
	splitSummaryDate(splitted[0])
	
	return;
}

// Split the Summary and DateTime
// DateTime -> (' at ' | ' on ' | ' by ') AbsoluteDateTime | RelativeDateTime | ('from' | 'between') DateTimeRange
function splitSummaryDate(input){

	// A separator can be found for Summary and DateTime
	var summaryDateSeparator = false;
	
	// (' on ' | ' by ') AbsoluteDateTime | [' at ' | ' on ' | ' by '] RelativeDateTime
	if (input.search(' on ') > 0){
		summaryDateSeparator = true;
		var splitted = input.split(' on ')
		if (input.match(relativeDate)){
			parseRelativeDateTime(splitted[1])
		} else {
			eventBegin = parseAbsoluteDateTime(splitted[1])
		}
	} else if (input.search(' by ') > 0){
		summaryDateSeparator = true;
		var splitted = input.split(' by ')
		if (input.match(relativeDate)){
			parseRelativeDateTime(splitted[1])
		} else {
			eventBegin = parseAbsoluteDateTime(splitted[1])
		}
	}

	// ('from' | 'between') DateTimeRange
	if (input.search(' from ') > 0 ) {
		summaryDateSeparator = true;
		var splitted = input.split(' from ');
		parseDateTimeRange(splitted[1]);
	} else if (input.search(' between') > 0) {
		summaryDateSeparator = true;
		var splitted = input.split(' between ');
		parseDateTimeRange(splitted[1]);
	}

	console.log(eventBegin)

	// eventEnd = eventBegin;
	// eventEnd.setHours(eventEnd.getHours() + 1); //Default event length is 1hr
	
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

// Convert date/time from input into date object
// function parseDateTime(input) {
	
// 	if (input.match(relativeDate)){
// 		parseRelativeDateTime(input);
// 		return;
// 		} else if (input.match(dateTimeRange)){
// 		parseDateTimeRange(input);
// 		return;
// 		} else {
// 		eventBegin = parseAbsoluteDateTime(input);
// 		eventEnd = parseAbsoluteDateTime(input);
		
// 		if (typeof eventEnd === Date)
// 		eventEnd.setHours(eventEnd.getHours() + 1); //Default event length is 1hr
		
// 		return;
// 	}
// }


function parseAbsoluteDateTime(input){
	// If date is missing altogether, reject
	if (!input || input == " ")
	return error("Could not find a date value (Error D1)")
	
	const referenceDate = new Date() // Reference Date
	var date = new Date() // Date Time to modify

	var splitted = input.split(' at ')

	// Try to initially create a Date Time object using constructor, return if successful
	var dateAttempt = new Date(splitted[0])
	if (dateAttempt != 'Invalid Date'){
		date = timeDecision(dateAttempt, splitted[1])
		return date
	} else {
		return "Error in date"
	}
	
	// If no good, try to parse as a relative date
	// dayMatchArray = input.toLowerCase().match(regExDayofWeek) 
	
	// if (dayMatchArray)
	// return setDateByDayOfWeek(date, dayMatchArray, referenceDate)
	// else
	// return error("Could not parse <i>" + input + "</i> as a date (Error D2)") // Date is unrecognizable
}

// RelativeDateTime -> RelativeDate ('at' | 'in the') (AbsoluteTime | RelativeTime)
function parseRelativeDateTime(input){
	
	var date = new Date() // Date Time to modify
	
	relativeDateMatch = input.match(relativeDate)[0];
	
	if (relativeDateMatch === 'tomorrow'){
		date.setDate(date.getDate() + 1);
		// date.setHours(9, 0, 0) // Default time to 9am
		} else if (relativeDateMatch === 'today'){
		date.setHours(date.getHours() + 2);
		} else if (relativeDateMatch === 'this'){
		dayOfWeek = input.split('this ')[1]
		date = parseAbsoluteDateTime(dayOfWeek)
		} else if (relativeDateMatch === 'next'){
		dayOfWeek = input.split('next ')[1]
		date = parseAbsoluteDateTime(dayOfWeek)
		date.setDate(date.getDate() + 7);
	}

	var splitted;
	if (input.search(' at' ) > 0){
		splitted = input.split(' at ')
	} else if (input.search(' in the ')){
		splitted = input.split(' in the ')
	}
	
	date = timeDecision(date, splitted[1])
	
	eventBegin = date;	
	eventEnd = date;
	eventEnd.setHours(eventEnd.getHours() + 1); //Default event length is 1hr	
	return;
}

// DateTimeRange -> AbsoluteDateTime (' - ' | ' to ' | ' and ') AbsoluteDateTime
function parseDateTimeRange(input){
	
	// Match the regex and split on that match
	rangeMatch = input.match(dateTimeRange);
	splitted = input.split(rangeMatch[0]);
	
	// Parse both dates
	eventBegin = parseAbsoluteDateTime(splitted[0]);
	eventEnd = parseAbsoluteDateTime(splitted[1]);
	
	return;
}

function setDateByDayOfWeek(date, dayMatchArray, referenceDate){	
	dayOfWeek = dayMatchArray[0].toLowerCase();
	
	// Match day of week from input
	if (dayOfWeek.startsWith('sun'))
	numberOfWeek = 0;
	else if (dayOfWeek.startsWith('mon'))
	numberOfWeek = 1;
	else if (dayOfWeek.startsWith('tue'))
	numberOfWeek = 2;
	else if (dayOfWeek.startsWith('wed'))
	numberOfWeek = 3;
	else if (dayOfWeek.startsWith('thu'))
	numberOfWeek = 4;
	else if (dayOfWeek.startsWith('fri'))
	numberOfWeek = 5;
	else if (dayOfWeek.startsWith('sat'))
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

function timeDecision(date, input) {
	input = input.toLowerCase();

	if (input.search('morning')){
		return date.setHours(9, 0, 0);
	} else if (input.search('afternoon')){
		return date.setHours(13, 0, 0)
	} else if (input.search('evening')){
		return date.setHours(17, 0, 0)
	} else if (input.search('night')){
		return date.setHours(21, 0, 0)
	}

	var splitted;
	if (input.search('am')){
		splitted = input.split(' am');
		date.setHours(parseInt(splitted[0]), 0, 0);
		return date;
	} else if (input.search('pm')){
		splitted = input.split(' pm');
		return date.setHours(parseInt(splitted[0]) + 12, 0, 0);
	}

	return "Error in Time"
}

// Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {		
	// Build the iCalendar file using ics.js library and parsed data. If no description, use empty string for file rather than "No description"
	icalOutput = ics();
	icalOutput.addEvent(eventSummary, eventDescription == "No description" ? '' : eventDescription, '', eventBegin, eventEnd);
	
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
	// Format date and time in en-US locale (try catch required since variable may contain non-date object)
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	try {eventBegin = eventBegin.toLocaleDateString("en-US", options) + ' ' + eventBegin.toLocaleTimeString();}
	catch {}
	try {eventEnd = eventEnd.toLocaleDateString("en-US", options) + ' ' + eventEnd.toLocaleTimeString();}
	catch {}
	
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
	'</span></li><li id="output-date-start">Date Start: <span class="output">' + eventBegin +
	'</span></li><li id="output-date-end">Date End: <span class="output">' + eventEnd + 
	'</span></li><li id="output-desc">Description: <span class="output">' + eventDescription + 
	'</span></li>';
}

// Format error strings in red and mark input as no good
function error(errorString) {
	inputGood = 0 // Mark user input as unacceptable once error occurs
	
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
	
	if (previewOnly != null)
	generateICS(0); // Preview only if &preview argument is also present
	else
	generateICS(1); // Otherwise download
}

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