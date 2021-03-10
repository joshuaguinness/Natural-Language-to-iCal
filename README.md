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
DATE Mon Mar 8 2021
TIME 4:00 pm
```
The actual output will be formatted according to the iCalendar specification and can be imported into most calendaring software.


### Implementation Details TODO
The converter will be implemented using JavaScript, which will allow the program to run client-side within any web browser.

Converting from natural language will comprise three major steps:
- Splitting the user input into component substrings
- Converting component substrings into matching iCalendar fields
- Formatting output per iCalendar specification

Additionally, the program will require an HTML frontend with which users will interact. The webpage will feature an input field and controls necessary to submit the natural language string and retrieve the output .ics file.

Finally, the project will be documented and presented... TODO ELABORATE


### Resources and References 
There will be multiple resources we will use and refer to for the development of this system. The language that we will use to create this system will be JavaScript. The reason for this choice is a combination of both our experience with this language and the ease of integrating it with a web based front-end. For our domain knowledge, we will reference both the COMP SCI 4TB3 Lecture Notes by Emil Sekerinski, as well as the iCalendar (RFC 5545) specifications (icalendar.org & tools.ietf.org/html/rfc5545). From the lecture notes, sections on regular languages/expressions will help us develop a grammar for our system. In addition, sections on parsers will help in implementing our grammar. One last recourse we will utilize is a date-time library for creating event objects in our system. The Date library is a built-in object in JavaScript, and we will be using Mozilla’s MDN Web Docs on the JavaScript Date object to help us utilize it (developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). These are the main resources that we will be using the develop our system. 


### Division of Work

#### Final Deliverables
All group members will work on all parts of the project, from the source code, to the final presentation. However, each group member will take the lead on each component of the final deliverable. This means that they will ensure that the component is of high quality. This means that they will likely do more on this component than the other group members. 

- Documentation: Jason Kim
- Testing: Arkin Modi 
- Final Presentation: Joshua Guinness 

#### Source Code
Although the overall source code will be worked on by all group members, each member will be assigned a module to focus on. This is show below.

- HTML + JS frontend: Jason Kim 
- Splitting user input into component substrings: Arkin Modi 
- Convert component substrings to iCal fields: Joshua Guinness 
- Assembling final iCal file: Jason Kim 


### Weekly Schedule
This is a proposed weekly schedule for how to finish the project before the April 12th deadline.

| Date | Work to be done |
| ------ | ------ |
| Week 0 | Project Proposal |
| Week 1 (11 – 17) | Initial work on frontend, planning for how to parse user input & split into substrings & convert substrings to iCal fields |
| Week 2 (18 – 24) | Finish up frontend, initial code for splitting user input into component substrings,  initial code for converting component substrings to iCal fields |
| Week 3 (25 - 31) | Further coding for parsing user input and converting substrings to iCal fields, initial code for assembling final iCal file |
| Week 4 (1 - 7) | Almost complete code for parsing user input and converting substrings to iCal fields, further coding for assembling final iCal file |
| Week 5 (8 - 14) | Complete source code, finish test cases to ensure correctness of code, finish documentation, start and finish presentation slides, submit all deliverables on GitLab |
| Week 6 (15 - 16) | Touch up on final presentation, practise presentation as a group, give final presentation|

Exact dates and progress on work are subject to change
