function liveUpdate() {
  var x = document.getElementById("userInput").value;  
  document.getElementById("output-summary").innerHTML = splitInput(x);
}

//Function to split up input string into parts by matching keywords/patterns between fields
function splitInput(input) {
  var input = input.trim(); //remove leading/trailing whitespace from input

  var splitted = input.split('at ');
  var first = splitted[0];
  var second = splitted[1];
  
  if (!second)
  second = "No date/time found in input"
  
  var output = 'SUMMRY: ' + first + '<br>DATE: ' + second;
  return output;
}

//Convert date/time from input into date object
function parseDate(input) {
  var input = input.toLowerCase();
  
  //if (input == "tomorrow")
  //output = date.now + 1 day //pseudocode
  //else if (input == "...")
  //output = something
  
  return output;
}


//Generate properly formatted .ICS file (once user hits enter or clicks submit btn
function generateICS(input) {
  var input = input.toLowerCase();
  
  //if (input == "tomorrow")
  //output = date.now + 1 day //pseudocode
  //else if (input == "...")
  //output = something
  
  return output;
}