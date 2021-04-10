#### COMP SCI 4TB3 Project Readme
# Natural Language to iCalendar Converter 
_Group 9: Joshua Guinness, Arkin Modi, Jason Kim_

### Project Overview
This repository hosts the code and accompanying documentation for our group's project, which converts a user’s schedule information from a natural language input to an output in the standard iCalendar (.ics) format. 

Users are able to easily create new calendar events using only their keyboard, providing information such as the event's name, date, and time together as part of one input string.

For example, natural language user input such as the following:
```js
Discuss group project at 4pm next mon. Bring notes
```
Would be converted to a structured format similar to:
```js
SUMMARY Discuss group project
DATE Monday, April 5 2021, 4:00PM EST
DESCRIPTION: Bring Notes
```

The system parses the input and displays recognized fields in a user friendly, non-iCalendar format on the page in real time. Pressing Enter then generates an .ics event file, which can be imported into almost any calendar application.

### How to Run
To access the demonstration page, download the contents of the `code` directory then open `index.html` in a web browser. There are two ways to use the demo page:

1. Enter event information directly into the textbox on the web page, then select to Download or Preview the resulting iCalendar file.
2. Send the input string as a URL parameter to immediately generate the output file with no additional interaction: 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```index.html?q=Take out trash on thursday```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To preview the output only, add an additional `p` parameter:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```index.html?q=Take out trash on thursday&p```

Note when using the second option, certain reserved characters including ` # $ & + ,  / : ; = ? @ [ ]` must be percent encoded, for example `&` entered as `%26`.

### Jest Unit Testing
#### Install
To install the jest unit testing framework, run the following from the root directory:
```
npm install
```

#### Run
To run the jest unit testing, run the following from the root directory:
```
npm run test
```