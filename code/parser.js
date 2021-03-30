// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter
// Open index.html in a web browser for demo webpage. The resources directory contains supporting files/framework/libraries
//
// This program makes use of the following open source libraries and frameworks: 
// TODO REFERENCES HERE
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
function splitAtPeriod(input) {
	
	// Split description from rest of input	
	splitted = input.split('. ');

	if (splitted[1]){ eventDescription = splitted[1]; } 
	else { eventDescription = "No description"; }

	splitSummaryDate(splitted[0])

	return;
}

// Split the summary and date
function splitSummaryDate(input){

	// Split summary from rest of input
	if (input.search(' on ') > 0){
		var splitted = input.split(' on ')
	} 
	else if (input.search(' at ') > 0){
		var splitted = input.split(' at ')
	} 
	else if (input.search(' from ') > 0){
		var splitted = input.split(' from ')
	}
	else if (input.search(' between') > 0){
		var splitted = input.split(' between ')
	}
	else { // If no summary-date separator in input, error
		eventSummary = input
		eventBegin = error("Could not find summary-date separator (Error S1)")
		eventEnd = ""
		return
	}

	eventSummary = splitted[0]
	parseDateTime(splitted[1]);	

	// Store notices if certain fields are missing from input
	if (!eventSummary)
	eventSummary = "Untitled Event"	
	if (!eventBegin)
	eventBegin = "No date"
	if (!eventEnd)
	eventEnd = "No date"

}

// Convert date/time from input into date object
function parseDateTime(input) {

	if (input.match(relativeDate)){
		parseRelativeDateTime(input);
		return;
	}

	if (input.match(dateTimeRange)){
		parseDateTimeRange(input);
		return;
	}

	eventBegin = parseAbsoluteDateTime(input);

	eventEnd = parseAbsoluteDateTime(input);
	eventEnd.setHours(eventEnd.getHours() + 1);//Default event length is 1hr

	return;
}

// TODO
function parseRelativeDateTime(input){
	
	var date = new Date() // Date Time to modify
	
	relativeDateMatch = input.match(relativeDate)[0];

	if (relativeDateMatch === 'tomorrow'){
		date.setDate(date.getDate() + 1);
		date.setHours(9, 0, 0) // Default time to 9am
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

	return;
}

function parseAbsoluteDateTime(input){
	const referenceDate = new Date() // Reference Date
	var date = new Date() // Date Time to modify
	date.setHours(9, 0, 0) // Default time to 9am

	// Try to initially create a Date Time object using constructor, return if successfull
	var dateAttempt = new Date(input)
	if (dateAttempt != 'Invalid Date') { return dateAttempt; }

	dayMatchArray = input.toLowerCase().match(regExDayofWeek) //Convert date to lowercase then match w/ regex

	if (dayMatchArray){ 
		date = setDateByDayOfWeek(date, dayMatchArray, referenceDate)
	}
	else { 
		return error("No date/time found in input (Error D1)") // If blank date arg received, Error
	}
	
	if (date == 'Invalid Date') {
		return error("Could not parse <i>" + input + "</i> as a date (Error D2)") // If date object is invalid, Error
	}
	
	return date;
}

function setDateByDayOfWeek(date, dayMatchArray, referenceDate){
	
	dayOfWeek = dayMatchArray[0].toLowerCase();

	var numberOfWeek;
	switch(dayOfWeek){
		case "sunday": numberOfWeek = 0; break;
		case "monday": numberOfWeek = 1; break;
		case "tuesday": numberOfWeek = 2; break;
		case "wednesday": numberOfWeek = 3; break;
		case "thursday": numberOfWeek = 4; break;
		case "friday": numberOfWeek = 5; break;
		case "saturday": numberOfWeek = 6; break;
		case "sun": numberOfWeek = 0; break;
		case "mon": numberOfWeek = 1; break;
		case "tues": numberOfWeek = 2; break;
		case "wed": numberOfWeek = 3; break;
		case "thur": numberOfWeek = 4; break;
		case "thurs": numberOfWeek = 4; break;
		case "fri": numberOfWeek = 5; break;
		case "sat": numberOfWeek = 6; break;
	}

	if (numberOfWeek > referenceDate.getDay()){
		date.setDate(date.getDate() + (numberOfWeek - date.getDay()))
	} else { 
		date.setDate(date.getDate() + 7 - (date.getDay() - numberOfWeek)) 
	}

	return date;
}

// Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {	
	// If no description, use empty string for file rather than "No description"
	if (eventDescription == "No description")
	var icsDescription = "";
	else 
	var icsDescription = eventDescription;
	
	// Build the iCalendar file using ics.js library and parsed data
	icalOutput = ics();
    icalOutput.addEvent(eventSummary, icsDescription, '', eventBegin, eventEnd);
	
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
	var output = '<li id="output-summary">Summary: <span class="output">' + eventSummary + 
	'</span></li><li id="output-date-start">Date Start: <span class="output">' + eventBegin + 
	'</span></li><li id="output-date-end">Date End: <span class="output">' + eventEnd + 
	'</span></li><li id="output-desc">Description: <span class="output">' + eventDescription + 
	'</span></li>';
	
	// Disable download button if the current input is unacceptable and update help text
	if (!inputGood) {
		document.getElementById("btnDownload").disabled = true;
		document.getElementById("helpText").innerHTML = 'Please fix the issues above to download your iCalendar file.';
	}
	else {
		document.getElementById("btnDownload").disabled = false; 
		document.getElementById("helpText").innerHTML = 'Press Enter or click Download to generate an iCalendar file for your event.';
	}
	
	return output
}


// Format error strings in red. Called by splitInput() and parseDate() when an error occurs
function error(errorString) {
	inputGood = 0 // Mark user input as unacceptable once error occurs
	
	// Format HTML error msg with CSS class
	if (!errorString) // If blank argument received, use default error message
	errorString = 'Sorry, an unknown error occurred (You should never see this)';
	return '<span class="output-error">' + errorString + '</span>';;
}