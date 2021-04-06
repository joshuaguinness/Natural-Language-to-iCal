# Software Documentation

**Function Name** \
**Input(s):** (list of input: type, description of parameter)\
**Output:** (type, description of output)\
**Description:** (summary of what function does)\
**Details:** (Optional detailed description of how function works)

_Example_:\
**splitInput** \
**Input(s):**
- input: string, string to parse

**Output:** string, parsed string \
**Description:** Function to split up input string into parts by matching keywords/patterns between fields

## parser.js

**liveUpdate** \
**Input:** None \
**Output:** None \
**Description:** Updates the currently recognized fields on the front-end.

**splitAtPeriod** \
**Input:**
- input : string, string to be split

**Output:** None \
**Description:** Splits the inputted string at all occurrences of ". ". Based on the specified input structure, anything before ". " is the date of the event and following ". " is the description of the event. The structure only supports one instance of ". ". The description are updated in the global variable, while the date is passed to splitSummaryDate().