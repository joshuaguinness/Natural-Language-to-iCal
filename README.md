#### COMP SCI 4TB3 Project Proposal
# Converting Natural Language to iCalendar Format 
_Group 9: Joshua Guinness, Arkin Modi, Jason Kim_


### Project Overview
We will develop a system which converts a user’s schedule information from a natural language input to an output in the standard *Internet Calendaring and Scheduling Core Object Specification* (“iCalendar”, “.ical”, or ".ics") format. 

This system will allow users to easily create new calendar event files with the use of only their keyboard, providing information such as the event's name, date, and time together as part of one input string, instead of filling separate fields as in a traditional calendar application. 

For example, natural language user input such as the following:
```js
discuss group project at 4p next mon
```
Would be converted to a structured format similar to:
```js
SUMMARY Discuss group project
DATE March 8, 2021
TIME 4:00 pm
```
The actual output will be formatted according to the iCalendar specification and can be imported into most calendaring software.

### How to Run
To access the demonstration page, download the contents of the `code` directory then open `index.html` in a web browser. There are two ways to use the demo page:

1. Enter event information directly into the textbox on the web page, then select to Download or Preview the resulting iCalendar file.
2. Send the input string as a URL parameter to immediately generate the output file with no additional interaction: 
```index.html?q=Take out trash on thursday```
To preview the output only, add an additional ```p``` parameter:
```index.html?q=Take out trash on thursday&p```

Note when using the second option, certain reserved characters including ``` # $ & + ,  / : ; = ? @ [ ]``` must be percent encoded, for example ```&``` entered as ```%26```.

### Jest Unit Testing
To run the jest unit testing, run the following from the root directory:

```
npm run test
```