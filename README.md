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


### Implementation Details
The converter will be implemented using JavaScript, which will allow the program to run client-side within any web browser.

Converting from natural language will comprise three major steps:
- Splitting the user input into component substrings
- Converting component substrings into matching iCalendar fields
- Formatting output per iCalendar specification

Additionally, the program will require an HTML frontend with which users will interact. The webpage will feature an input field and controls necessary to submit the natural language string and retrieve the output .ics file.

The software will be tested to ensure that for a given input, the output is either a valid iCalendar event or an error message, in cases where the input contained nonsense or invalid components.

With this project, our group hopes to gain a better understanding of language processing and conversion, particularly with natural languages with which everyone is familiar.


### Resources and References 
Many resources will be used in the development of this system, both from the lectures and online documentation. For our domain knowledge, we will reference both the COMP SCI 4TB3 Lecture Notes by Emil Sekerinski, as well as the iCalendar (RFC 5545) specifications (icalendar.org & tools.ietf.org/html/rfc5545). From the lecture notes, sections on regular languages/expressions will help us to develop a grammar for our system to parse and split the input string into parts for processing.

The converter will be created in JavaScript, due to both our experience with this language and the ease of integrating it with a web based front-end. Consequently, documentation from sources such as the Mozilla Developer Network (developer.mozilla.org/en-US/docs/Web/JavaScript) and W3Schools (w3schools.com/js) will be used.

Since schedules inherently deal with dates and times, the built-in JavaScript date object in particular will be used extensively (developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). This resource will help perform date-related calculations and to convert relative dates/times given by the user to an absolute date object, for instance:
```js
"tomorrow" -> Date("March 10, 2021");
```

### Division of Work

##### Programming
The system will be "modularized" such that each major function will be handled by a separate part of the program. The development work will be shared by all group members but managed by one person for a given module to ensure that it is of high quality.
- HTML + JavaScript frontend: Jason Kim
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