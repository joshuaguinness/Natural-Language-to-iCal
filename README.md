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

Additionally, the program will require an HTML frontend with which users will interact. The simple webpage will feature a prominent input field and controls necessary to submit the natural language string and retrieve the output .ics file.

Finally, the project will be documented and presented... TODO ELABORATE


### Timeline TODO
Section description TODO

| Date | Work to be done |
| ------ | ------ |
| Week 0 | Project Proposal |
| Week 1 (11 – 17) | Module 1 |
| Week 2 (11 – 17) | Module 2... |
Exact dates are subject to change

### Resources and References TODO
Sections
- Emil Sekerinski. CS 4TB3 Lecture Notes
- https://icalendar.org/ - iCal standard
- https://tools.ietf.org/html/rfc5545 - iCal standard (RFC 5545)
- ....