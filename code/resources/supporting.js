// Supporting non-language-processing-related code for COMP SCI 4TB3 Group 9 Project - Natural Language to iCalendar converter.
// See parser.js for main program. Open index.html in a web browser for demo page.
// ==========================================================


// Functions & related variables to enter some sample text for manual testing/demo
var i = 0;
var txt;
var speed = 10;
function sampleInput(testNum) {	
	var testStrings = ['Meet with group by next saturday at 11:30 am',
		'Complete project by Wed Apr 14 at night. Submit everything on Gitlab',
		'Project presentation from 4/16 at 10:30am to 4/16 at 10:40am. Prep slides',
		'This is an unacceptable input  Fri at whenever. Summary-date separator is missing',
		'This is invalid from Appr 27 at 8:23pm to mon at 2a2:03pm. Due to bad dates',
	'This is no good between 5/4-4/28. Because of the invalid date range'];
	
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