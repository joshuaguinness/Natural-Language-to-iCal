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
**Parameters:** None \
**Returns:** None \
**Description:** Updates the currently recognized fields on the front-end. \
**Associated Production(s):** None \

**splitAtPeriod** \
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the inputted string at all occurrences of ". ". Based on the specified grammar structure, anything before ". " is the date and summary of the event and following ". " is the description of the event. The grammar only supports one instance of ". ". The description is updated in the global variable, while the date and summary are passed to splitSummaryDate(). \
**Associated Production(s):** `S -> Summary Date ". " Description`

**splitSummaryDate** \
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the summary and date to be processed separately. Summary is updated in the global variable while date is further parsed to determine whether the date is an absolute date, relative date, or date range. The date is passed to the associated functions for further parsing. Inludes error handling for no summary-date separators and no summary or date. \
**Associated Production(s):** `DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange`

**parseAbsoluteDateTime** \
**Input:** input : string, date to parse
