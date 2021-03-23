// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter
// Open index.html in a web browser for demo webpage. The resources directory contains supporting files/framework/libraries
//
// This program makes use of the following open source libraries and frameworks: 
// TODO REFERENCES HERE
//
// ==========================================================

// Global variables
var eventSummary, eventDescription, eventBegin, eventEnd // Vars for event field data
var inputGood // Whether user's input is acceptable


// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b"
var regExMonth = "\\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\b"
var relativeDate = "((?:next|last|this) (?:week|month|year)|tom(?:orrow)?|tmrw|tod(?:ay)?|(?:right )?now|tonight|day after (?:tom(?:orrow)?|tmrw)|yest(?:erday)?|day before yest(?:erday)?)"


// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	var userInput = document.getElementById("userInput").value; // Get user's input from textbox
	document.getElementById("liveOutput").innerHTML = splitInput(userInput); // Call parsing functions and display returned value on page
	
	if (userInput) // Hide live output area if input is empty
	document.getElementById("output").hidden = false;
	else
	document.getElementById("output").hidden = true;
}


// Function to split up input string into parts by matching keywords/patterns between fields
function splitInput(input) {
	inputGood = 1 // Initially assume user's input is acceptable
	//var input = input.toLowerCase(); // TODO recognize split keywords regardless of capitalization (but without modifying original string)
	
	if (input.search(' on ') > 0){
		var splitted = input.split( 'on' )
	} else if (input.search(' at ') > 0){
		var splitted = input.split( 'at' )
	}

	eventSummary = splitted[0].trim();
	
	if (!splitted[1]) { // If split unsuccessful (ie, input contained no substring)
		inputGood = 0 // Mark user input as unacceptable
		eventBegin = error("Could not find summary-date separator (Error S1)")
		eventEnd = ""
		eventDescription = ""
	}
	else { // If split successful, save first half as event summary
		splitted = splitted[1].split('. ');
		eventBegin = parseDate(splitted[0]);
		eventEnd = parseDate(splitted[0]); // TODO: Keep same if single-day event. If datetime range is given, set this to end		
		eventDescription = splitted[1];		
		}
	
	if (!eventSummary)
	eventSummary = "Untitled Event"	
	if (!eventBegin) // Summary-Date separator substring not found
	eventBegin = "No date"
	if (!eventEnd)
	eventEnd = "No date"
	if (!eventDescription)
	eventDescription = "No description"	
	
	var output = '<li id="output-summary">Summary: <span class="output">' + eventSummary + 
	'</span></li><li id="output-date-start">Date Start: <span class="output">' + eventBegin + 
	'</span></li><li id="output-date-end">Date End: <span class="output">' + eventEnd + 
	'</span></li><li id="output-desc">Description: <span class="output">' + eventDescription + 
	'</span></li>';
	
	if (!inputGood) {
	document.getElementById("btnDownload").disabled = true;
	document.getElementById("helpText").innerHTML = 'Please fix the issues above to download your iCalendar file.';
	}
	else {
	document.getElementById("btnDownload").disabled = false; 
	document.getElementById("helpText").innerHTML = 'Press Enter or click Download to generate an iCalendar file for your event.';
	}
	
	return output;
}


// Convert date/time from input into date object
function parseDate(input) {
	//if (input == "tomorrow")
	//output = date.now + 1 day

	const referenceDate = new Date()

	dayMatchArray = input.match(regExDayofWeek)
	
	if (input){
		if (dayMatchArray){
			var date = new Date()
			dayOfWeek = dayMatchArray[0]
			var numberOfWeek;
			switch(dayOfWeek){
				case "sunday": numberOfWeek = 0; break;
				case "monday": numberOfWeek = 1; break;
				case "tuesday": numberOfWeek = 2; break;
				case "wednesday": numberOfWeek = 3; break;
				case "thursday": numberOfWeek = 4; break;
				case "friday": numberOfWeek = 5; break;
				case "saturday": numberOfWeek = 6; break;
			}
			if (numberOfWeek > referenceDate.getDay()){
				date.setDate(date.getDate() + (numberOfWeek - date.getDay()))
			} else {
				date.setDate(date.getDate() + 7 - (date.getDay() - numberOfWeek))
			}
		} else {
			var date = new Date(input); // Create date object with input
		}
	} else {		
		inputGood = 0 // Mark user input as unacceptable
		return error("No date/time found in input (Error D1)") // If no input received, return Error 1
	}

	if (date == 'Invalid Date') {
		var output = error("Could not parse <i>" + input + "</i> as a date (Error D2)") // If date object is invalid, return Error 2)	
		inputGood = 0 // Mark user input as unacceptable
	}
	else
	var output = date;
	
	return output;
}


// Generate properly formatted .ICS file (once user hits enter or clicks submit btn. Arg 1 = download, arg 0 = view only
function generateICS(arg) {
	// Build the iCalendar file using ics.js library and parsed data
	icalOutput = ics();
    icalOutput.addEvent(eventSummary, eventDescription, '', eventBegin, eventEnd);
	
	// Give user the .ics or display the preview
	if (arg) {
		if (inputGood) // Download only if the input was acceptable
		icalOutput.download(eventSummary);
	}
	else
	viewOnly(icalOutput);
	return;
}


// Format error strings in red
function error(errorString) {	
	if (!errorString) // Default text if no error msg received
	errorString = 'Sorry, an unknown error occurred (You should never see this)';
	return '<span class="output-error">' + errorString + '</span>';;
}