# Software Documentation

The documentation serves to function as a tool for readers to better understand the implementation details, specifically how the functions work. Each function in the `parser.js` file is listed, and info is provided about its inputs, outputs, and purpose. An example is below.

**Function Name** \
**Input(s):** (list of input: type, description of parameter)\
**Output:** (type, description of output)\
**Description:** (summary of what function does)\
**Details:** (Optional detailed description of how function works)
**Associated Production(s):** (Optional production that the function is associated with)

## parser.js

### **Functions associated with the grammar**

#### splitAtPeriod
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the inputted string at all occurrences of ". ". Based on the specified grammar structure, anything before ". " is the date and summary of the event and following ". " is the description of the event. The grammar only supports one instance of ". ". The description is updated in the global variable, while the date and summary are passed to splitSummaryDate(). \
**Associated Production(s):** `S -> Summary Date ". " Description`

#### splitSummaryDate
**Input:** input : string, string to be split \
**Output:** None \
**Description:** Splits the summary and date to be processed separately. Summary is updated in the global variable while date is further parsed to determine whether the date is an absolute date, relative date, or date range. The date is passed to the associated functions for further parsing. Inludes error handling for no summary-date separators and no summary or date. \
**Associated Production(s):** `DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange`

#### parseAbsoluteDateTime
**Input:** input : string, date to parse \
**Output:** date: Date, to be displayed \
**Description:** Creates a Date object using the input into the function and returns that Date object. Has error handling and additional code for constructing the date from user input should the user provide incorrect input. \
**Associated Production(s):** `AbsoluteDateTime -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) ['at' (AbsoluteTime | RelativeTime)]`, `DayOfMonth -> 1 | ... | 31​`, `MonthNumber -> 1 | ... | 12​`, `MonthName -> 'Jan' [ 'uary' ] | ... | 'Dec' [ 'ember' ]`, `Year -> ( 2002 | ... | 2999 ) | ( 00 | ... | 99 )​​`

#### parseRelativeDateTime
**Input:** input : string, date to parse \
**Output:** None \
**Description:** Recognizes relative date strings from input and creates date object. eventBegin and eventEnd global variables are updated the date. \
**Associated Production(s):** `RelativeDateTime -> RelativeDate [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]`

#### parseDateTimeRange
**Input:** input : string, date to parse \
**Output:** None \
**Description:** Parses a date-time range by splitting it into two parts and passing each half to `parseAbsoluteDateTime`. Checks to ensure that eventEnd does not occure before eventBegin. Updates the global variables as well. \
**Associated Production(s):** `DateTimeRange -> AbsoluteDateTime ('-' | ' to ' | ' and ') AbsoluteDateTime`

#### setDateByDayOfWeek
**Input:** date : Date, date being processed | dayMatchArray : Array, input matched by `regExDayofWeek` | referenceDate : Date, current date \
**Output:** date : Date, updated date based on day of week \
**Description:** Finds the matching day of the week that the input is referring to and updates the date with that proper day. \
**Associated Production(s):** `DayOfWeek -> 'Mon' [ 'day' ] | ... | 'Sun' [ 'day' ]`​

#### timeDecision
**Input:** date : Date, date being processed | input : String, date to be parsed \
**Output:** date : Date, date with the correct time \
**Description:** Processes the time portion of the input and corrects the date with the current time. Supports absolute times as well as relative time (e.g. morning, night). \
**Assocaited Production(s):** `AbsoluteTime -> HourTime [ ':' MinuteTime] [ ' ' ] ( 'am'| 'pm' )`, `RelativeTime -> 'morning' | 'noon' | 'afternoon | 'evening' | 'night'​`, `HourTime -> 1 | ... | 12​`, `MinuteTime -> 1 | ... | 60​`

---

### **Other functions**

#### liveUpdate
**Parameters:** None \
**Returns:** None \
**Description:** Updates the currently recognized fields on the front-end.

#### generateICS
**Input:** arg : Integer, signals whether to preview ICS file or download \
**Output:** None \
**Description:** Generate properly formatted .ICS file (once user hits enter or clicks download btn. Arg 1 = download, arg 0 = view only.

#### formatHTML
**Input:** eventSummary : String, summary of calendar event | eventBegin : Date, start of the event | eventEnd : Date, end of the event | eventDescription : String, Additional description of the event \
**Output:** output : HTML, formatted output \
**Description:** Format live output HTML

#### formatDate
**Input:** date : Date, date to to be formatted \
**Output:** date : Date, formatted date-time \
**Description:** Format date and time in en-US locale depending on whether its an all day event or not.

#### error
**Input:** errorString : String, error to be output \
**Output:** error : HTML, error to be displayed \
**Description:** Format error strings in red and mark input as no good.

#### onLoad
**Input:** None \
**Output:** None \
**Description:** Automatically fills input using URL parameter and generates file immediately.
