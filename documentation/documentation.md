# Software Documentation

**Function Name** \
**Input(s):** (list of input: type, description of parameter)\
**Output:** (type, description of output)\
**Description:** (summary of what function does)\
**Details:** (Optional detailed description of how function works)

_Example_:\
**splitInput** \
**Input(s):** input: string, string to parse \
**Output:** string, parsed string \
**Description:** Function to split up input string into parts by matching keywords/patterns between fields

## parser.js

**liveUpdate** \
**Input:** None \
**Output:** None \
**Description:** Updates the currently recognized fields on the front-end.

**splitAtPeriod** \
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the inputted string at all occurrences of ". ". Based on the specified grammar structure, anything before ". " is the date and summary of the event and following ". " is the description of the event. The grammar only supports one instance of ". ". The description are updated in the global variable, while the date and summary are passed to splitSummaryDate().

**splitSummaryDate** \
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the inputted string at all occurrences of ". ". Based on the specified input structure, the words "on", "at", "from", and "between" are what separate the date and the summary. The date is passed to parseDateTime() and the summary is updated in the global variable.