#### COMP SCI 4TB3 Project Proposal 

# Converting Natural Language to iCal Format 
_Group 9: Joshua Guinness, Arkin Modi, Jason Kim_


### Summary
We will develop a system to convert a user’s schedule and event information from a natural language input to an output in the Internet Calendaring and Scheduling Core Object Specification (“iCalendar” or “iCal”) format. 

This system will allow users to quickly and naturally create new calendar events with the use of only their keyboard, providing information such as the event name, date and time together as part of one input string. 


For example, natural language user input such as the following:
```
discuss group project at 4p next mon
```
Would be converted to a structured format similar to:
```sh
SUMMARY Discuss group project
DATE Mon Mar 8 2021
TIME 4:00 pm
```

The parser would then process the input by separating the input into substrings for each component, then recognizing TODO

The implementation will be done in JavaScript, which will allow the program to run client-side within any web browser. 



### References
Sections
- Emil Sekerinski. CS 4TB3 Lecture Notes
- https://icalendar.org/ - iCal standard
- https://tools.ietf.org/html/rfc5545 - iCal standard (RFC 5545)
- 
-....

### Timeline
Dates are subject to change

| Date | Work to be done |
| ------ | ------ |
| Week 0 | Project Proposal |
| Week 1 (11 – 17) | Module 1 |
| Week 2 (11 – 17) | Module 2... |