// Main program code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter
// Open index.html in a web browser for demo webpage. The resources directory contains supporting files/framework/libraries
//
// This program makes use of the following open source libraries and frameworks: 
// TODO REFERENCES HERE
//
// ==========================================================

// Patterns to match from user's input
var regExDayofWeek = "\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b"
var regExMonth = "\\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\b"
var relativeDate = "((?:next|last|this) (?:week|month|year)|tom(?:orrow)?|tmrw|tod(?:ay)?|(?:right )?now|tonight|day after (?:tom(?:orrow)?|tmrw)|yest(?:erday)?|day before yest(?:erday)?)"


// Function to show recognized fields in real time (not necessarily in exact iCal format). Runs whenever user's input changes.
function liveUpdate() {
	var userInput = document.getElementById("userInput").value; // Get user's input from textbox
	document.getElementById("liveOutput").innerHTML = splitInput(userInput); // Call parsing functions and display returned value on page
	
	if (userInput) // ide live output area if input is empty
	document.getElementById("output").hidden = false;
	else
	document.getElementById("output").hidden = true;
}


// Function to split up input string into parts by matching keywords/patterns between fields
function splitInput(input) {
	var input = input.trim(); //remove leading/trailing whitespace from input
	
	var splitted = input.split(' at ');
	var first = splitted[0];
	var second = splitted[1];	
	
	var output = '<li id="output-summary"><b>SUMMARY: </b>' + first + 
	'</li><li id="output-date"><b>DATE: </b>' + parseDate(second) + 
	'</li><li id="output-misc"><b>Some other field: </b>...' + 
	'</li>';
	return output;
}


// Convert date/time from input into date object
function parseDate(input) {
	//if (input == "tomorrow")
	//output = date.now + 1 day
	
	if (input)
	var date = new Date(input); // Create date object with input
	else
	return error(1, input) // If no input received, return err "No date/time found in input (Error 1)"
	
	if (date == 'Invalid Date')
	var output = error(2, input) // If date object is invalid, return err "A date value was received but couldn't be parsed (Error 2)"
	else
	var output = date;
		
	return output;
}


// Generate properly formatted .ICS file (once user hits enter or clicks submit btn
function generateICS() {
	alert('TODO')
	//TODO
	return;
}



// Error code output strings
function error(errorCode, errorString) {	
	switch (errorCode) {
		case 1:
		errorString = "No date/time found in input (Error 1)";
		break;
		case 2:
		errorString = "Could not parse <i>" + errorString + "</i> as a date (Error 2)";
		break;
		default:
		errorString = "Sorry, an unknown error occurred (You should never see this)";
	}	
	return errorString;
}