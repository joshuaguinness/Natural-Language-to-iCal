#### Production rules for input string

```
S ->                Summary DateTime [". " Description]​
Summary ->          [ Word ]+​
DateTime ->         (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] ​
                    RelativeDateTime | (' from ' | 'between ') DateTimeRange​
AbsoluteDateTime -> ( ( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) ​
                    | DayOfMonth '/' MonthNumber [ '/' Year ] ) ​
                    [ 'at' ( AbsoluteTime | RelativeTime ) ]​
RelativeDateTime -> RelativeDate [ (' at ' | ' in the ') ( AbsoluteTime | RelativeTime ) ]​
DateTimeRange ->    AbsoluteDateTime ( ' - ' | ' to ' | ' and ' ) AbsoluteDateTime​
RelativeDate ->     'tomorrow' | 'today' | ( ( 'this' | 'next' ) DayOfWeek )​
AbsoluteTime ->     HourTime [ ':' MinuteTime] [ ' ' ] ( 'am'| 'pm' )
DayOfWeek ->        'Mon' [ 'day' ] | ... | 'Sun' [ 'day' ]​
DayOfMonth ->       1 | ... | 31​
MonthNumber ->      1 | ... | 12​
MonthName ->        'Jan' [ 'uary' ] | ... | 'Dec' [ 'ember' ]​
Year ->             ( 2002 | ... | 2999 ) | ( 00 | ... | 99 )​
RelativeTime ->     'morning' | 'noon' | 'afternoon | 'evening' | 'night'​
HourTime ->         1 | ... | 12​
MinuteTime ->       1 | ... | 60​
Description ->      [ Word ]*​
Word ->             [ a-zA-Z0-9 ]+ | '!' | '?' | ' ' | '/' | '_' | ...​
```