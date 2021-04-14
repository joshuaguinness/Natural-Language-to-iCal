#### COMP SCI 4TB3 Project Readme
# Natural Language to iCalendar Converter 
_Group 9: Joshua Guinness, Arkin Modi, Jason Kim_

### Project Overview
This repository hosts the code and accompanying documentation for our group's language processor, which converts a user’s schedule information from a natural language input to an output in the standard [iCalendar](https://en.wikipedia.org/wiki/iCalendar) (.ics) format.

Users can easily create new calendar events using only their keyboard, providing information such as the event's name, date, and time together as part of one input string.

For example, natural language user input such as the following:
```
Discuss project by this monday at 4pm. Bring notes
```
Would be converted to a structured format similar to:
```
BEGIN:VCALENDAR​
PRODID:Calendar​
VERSION:2.0​
BEGIN:VEVENT​
UID:0@default​
CLASS:PUBLIC​
DTSTAMP;VALUE=DATE-TIME:20210413T042828​
DTSTART;VALUE=DATE-TIME:20210419T160000​
DTEND;VALUE=DATE-TIME:20210419T170000​
SUMMARY;LANGUAGE=en-us:Discuss project​
DESCRIPTION:Bring notes​
TRANSP:TRANSPARENT​
END:VEVENT​
END:VCALENDAR​
```

The system first parses the input and displays recognized fields in a user friendly, non-iCalendar format on the page in real time. Pressing Enter then generates an .ics event file, which can be imported into almost any calendar application.

### How to Run
The language processor is implemented in JavaScript and we have prepared a demonstration webpage. It can be accessed by downloading the contents of the `code` directory then opening `index.html` in a web browser. There are two ways to use the demo:

1. Enter event information directly into the textbox on the web page, then select to Download or Preview the resulting iCalendar file.
2. Send the input string as a URL parameter to immediately generate the output file with no additional interaction: 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```index.html?q=Take out trash on thursday```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To preview the output only, add an additional `p` parameter:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```index.html?q=Take out trash on thursday&p```

Note when using the second option, certain reserved characters including ` # $ & + ,  / : ; = ? @ [ ]` must be percent encoded, for example `&` entered as `%26`.

### Automated Testing

Automated tests were performed using the Jest unit testing framework. To install Jest, run the following from the root directory:
```
npm install
```

Then, to perform the tests, run the following from the root directory:
```
npm run test
```

### More Information
For additional details on our project, please refer to the project proposal, slides, and accompanying files in the `documentation` directory.