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

##### Closely Related Work
There are a few closely related pieces of software to what we are trying to create. They are documented below.

- http://quickcalapp.com/ and https://flexibits.com/fantastical (Third Party MacOS or iOS apps that allow users to add calender events using natural language)
- MacOS Calendar (The MacOS calendar has a natural language to calendar event feature)
- https://github.com/wanasit/chrono (Open source natural language date parser)
- https://www.microassist.com/software-tips/outlook-calendar-shortcuts-natural-language/ (Outlook supports natural language abbreviations when picking dates)
- https://polymaths.blog/2018/06/fantastically-good-event-parser-for-drafts-5 (Natural language to events)

Although all of these are similar to our project, and work within the same domain, our project will be unique because:
- it will be platform independent
- it will generate an iCal file that can be used anywhere or sent somewhere
- it will not be limited to just date/time parsing but the entire submitted natural language calendar event

### Implementation Details
The converter will be implemented using JavaScript, which will allow the program to run client-side within any web browser.

Converting from natural language will comprise three major steps:
- Splitting the user input into component substrings
- Converting component substrings into matching iCalendar fields
- Formatting output per iCalendar specification

Additionally, the program will require an HTML frontend with which users will interact. The webpage will feature an input field and controls necessary to submit the natural language string and retrieve the output .ics file.

This software will consist of unit tests for each module, as well as integration tests between the modules. The unit tests will ensure that each module is working correctly in isolation, and each function is performing its duties correctly. These tests will simply check whether an input matches a specified output, or whether the correct exception/error is raised. The integration tests will check whether the full flow is working correctly, from input to output. In these tests, a given input will be used and the expected iCal output will be compared with the actual iCal output to confirm the correctness of the system.

This system will be documented in two ways. The first is documentation within the code. This will consist of comments and additional documentation of functions, and files. The second will be written documentation explaining how the parsing and conversion works, complete with diagrams about system architecture and how input flows through the system.

With this project, our group hopes to gain a better understanding of language parsing and conversion, particularly with natural languages with which everyone is familiar. We also hope to develop something useful and make open source so that it can be extended, or expanded on later.


### Resources and References 
We expect to use many different resourcess during the development of this system, including lectures from class and various online sources.

For our domain knowledge, we will reference both the lecture notes as well as the iCalendar (RFC 5545) specifications. From the lecture notes, the sections on regular languages and expressions will help us to develop a grammar for our system to parse and split the input string into parts for processing.
- COMP SCI 4TB3 Lecture Notes by Emil Sekerinski
- https://icalendar.org/
- https://tools.ietf.org/html/rfc5545

The converter will be created in JavaScript, due to both our experience with this language and the ease of integrating it with a web based front-end. Consequently, documentation from sources such as the Mozilla Developer Network and W3Schools will be used.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript
- https://www.w3schools.com/js/

Since schedules inherently deal with dates and times, the built-in JavaScript date object in particular will be used extensively.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

 This resource will help perform date-related calculations and to convert relative dates/times given by the user to an absolute date object, for example:
 ```js
"tomorrow" -> Date("March 10, 2021");
```

### Division of Work

##### Programming
The system will be "modularized" such that each major function will be handled by a separate part of the program. The development work will be shared by all group members but managed by one person for a given module to ensure that it is of high quality.
- Frontend HTML: Jason Kim
- Splitting user input into component substrings: Arkin Modi
- Convert component substrings to iCal fields: Joshua Guinness
- Assembling final iCalendar file: Jason Kim

##### Final Deliverables
As with the programming, group members will share the work on all parts of the project. However, one member will take the lead on a particular component of the final deliverable.
- Documentation: Jason Kim
- Testing: Arkin Modi
- Final Presentation: Joshua Guinness

### Weekly Schedule
This is a proposed weekly schedule for how to finish the project before the April 12th deadline.

| Date | Work to be done |
| ------ | ------ |
| Week 0 | Project Proposal |
| Week 1 (11 - 17) | Initial work on frontend, planning for how to parse user input & split into substrings & convert substrings to iCal fields |
| Week 2 (18 - 24) | Finish up frontend, initial code for splitting user input into component substrings,  initial code for converting component substrings to iCal fields |
| Week 3 (25 - 31) | Further coding for parsing user input and converting substrings to iCal fields, initial code for assembling final iCal file |
| Week 4 (1 - 7) | Almost complete code for parsing user input and converting substrings to iCal fields, further coding for assembling final iCal file |
| Week 5 (8 - 14) | Complete source code, finish test cases to ensure correctness of code, finish documentation, start and finish presentation slides, submit all deliverables on GitLab |
| Week 6 (15 - 16) | Touch up on final presentation, practice presentation as a group, give final presentation|

Exact dates and progress on work are subject to change
